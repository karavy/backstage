import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const postgresqlCnpgPlugin = createPlugin({
  id: 'postgresql-cnpg',
  routes: {
    root: rootRouteRef,
  },
});

export const PostgresqlCnpgPage = postgresqlCnpgPlugin.provide(
  createRoutableExtension({
    name: 'PostgresqlCnpgPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
