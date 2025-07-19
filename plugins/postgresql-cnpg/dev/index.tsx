import { createDevApp } from '@backstage/dev-utils';
import { postgresqlCnpgPlugin, PostgresqlCnpgPage } from '../src/plugin';

createDevApp()
  .registerPlugin(postgresqlCnpgPlugin)
  .addPage({
    element: <PostgresqlCnpgPage />,
    title: 'Root Page',
    path: '/postgresql-cnpg',
  })
  .render();
