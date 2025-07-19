import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const createAppPlugin = createPlugin({
  id: 'create-app',
  routes: {
    root: rootRouteRef,
  },
});

export const CreateAppPage = createAppPlugin.provide(
  createRoutableExtension({
    name: 'CreateAppPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
