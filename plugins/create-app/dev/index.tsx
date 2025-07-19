import { createDevApp } from '@backstage/dev-utils';
import { createAppPlugin, CreateAppPage } from '../src/plugin';

createDevApp()
  .registerPlugin(createAppPlugin)
  .addPage({
    element: <CreateAppPage />,
    title: 'Root Page',
    path: '/create-app',
  })
  .render();
