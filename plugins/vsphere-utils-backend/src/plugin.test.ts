import {
  mockCredentials,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { vsphereUtilsPlugin } from './plugin';
import request from 'supertest';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

// TEMPLATE NOTE:
// Plugin tests are integration tests for your plugin, ensuring that all pieces
// work together end-to-end. You can still mock injected backend services
// however, just like anyone who installs your plugin might replace the
// services with their own implementations.
describe('plugin', () => {
  it('should create and read TODO items', async () => {
    const { server } = await startTestBackend({
      features: [vsphereUtilsPlugin],
    });

    await request(server).get('/api/vsphere-utils/todos').expect(200, {
      items: [],
    });

    const createRes = await request(server)
      .post('/api/vsphere-utils/todos')
      .send({ title: 'My Todo' });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toEqual({
      id: expect.any(String),
      title: 'My Todo',
      createdBy: mockCredentials.user().principal.userEntityRef,
      createdAt: expect.any(String),
    });

    const createdTodoItem = createRes.body;

    await request(server)
      .get('/api/vsphere-utils/todos')
      .expect(200, {
        items: [createdTodoItem],
      });

    await request(server)
      .get(`/api/vsphere-utils/todos/${createdTodoItem.id}`)
      .expect(200, createdTodoItem);
  });

  it('should create TODO item with catalog information', async () => {
    const { server } = await startTestBackend({
      features: [
        vsphereUtilsPlugin,
        catalogServiceMock.factory({
          entities: [
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'my-component',
                namespace: 'default',
                title: 'My Component',
              },
              spec: {
                type: 'service',
                owner: 'me',
              },
            },
          ],
        }),
      ],
    });

    const createRes = await request(server)
      .post('/api/vsphere-utils/todos')
      .send({ title: 'My Todo', entityRef: 'component:default/my-component' });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toEqual({
      id: expect.any(String),
      title: '[My Component] My Todo',
      createdBy: mockCredentials.user().principal.userEntityRef,
      createdAt: expect.any(String),
    });
  });
});
