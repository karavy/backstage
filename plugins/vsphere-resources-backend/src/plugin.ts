import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { getVSphereFolder } from './services/VsphereResourcesService';

/**
 * vsphereResourcesPlugin backend plugin
 *
 * @public
 */
export const vsphereResourcesPlugin = createBackendPlugin({
  pluginId: 'vsphere-resources',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
      },
      async init({ logger, httpAuth, httpRouter, catalog }) {
        const getVSphereFolder = await getVSphereFolder({
          logger,
          catalog,
        });

        httpRouter.use(
          await createRouter({
            httpAuth,
            getVsphereFolder,
          }),
        );
      },
    });
  },
});
