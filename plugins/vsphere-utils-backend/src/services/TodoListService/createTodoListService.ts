import { LoggerService } from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import crypto from 'node:crypto';
import { TodoItem, TodoListService } from './types';
import axios, { AxiosError } from 'axios';
import https from 'https';

// TEMPLATE NOTE:
// This is a simple in-memory todo list store. It is recommended to use a
// database to store data in a real application. See the database service
// documentation for more information on how to do this:
// https://backstage.io/docs/backend-system/core-services/database


export async function createTodoListService({
  logger,
  catalog,
}: {
  logger: LoggerService;
  catalog: typeof catalogServiceRef.T;
}): Promise<TodoListService> {
  logger.info('Initializing TodoListService');

  const storedTodos = new Array<TodoItem>();

  async function doVSphereQuery(request: {query: string, queryFilter: string}) {
    let apiToken: string | null = null;
    const vcenterConfig = ""//config.getConfig('vcenter');
    const apiUrl = "https://10.19.6.1" //vcenterConfig.getString('apiUrl');
    const username = "readonly-api-client@vsphere.local"//vcenterConfig.getString('username');
    const password = "4We1OG%KTZ!" //vcenterConfig.getString('password');
    const filterQuery = ""

    // Per lo sviluppo, potremmo voler ignorare i certificati self-signed
    // ATTENZIONE: Non usare 'rejectUnauthorized: false' in produzione!
    const agent = new https.Agent({
      rejectUnauthorized: false, 
    });

    let matchingFolders, folders = null

    try {
      // 1. Autenticazione per ottenere il token
      const authResponse = await axios.post(
        `${apiUrl}/rest/com/vmware/cis/session`,
        {},
        {
          auth: { username, password },
          httpsAgent: agent,
        },
      );
      apiToken = authResponse.data.value;
  
      // 2. Recupero delle folder
      const folderResponse = await axios.get<VCenterFolderResponse>(
        //`${apiUrl}/rest/vcenter/resource-pool`,
        `${apiUrl}${request.query}`,
        {
          headers: { 'vmware-api-session-id': apiToken! },
          httpsAgent: agent,
        },
      );
      folders = folderResponse.data.value;
  
      // 3. Filtro lato server
      if (request.queryFilter != null) {
	const matchingFolders = folders.filter(folder =>
          folder.name.toLowerCase().includes(request.queryFilter.toLowerCase())
        );

        if (matchingFolders.length > 0) {
	  folders = matchingFolders;
          matchingFolders.forEach(folder => {
            console.log(`- ${folder.name}`);
          });
        };
      };

  
    } catch (error) {
      const axiosError = error as AxiosError;
      logger.error('Errore durante la comunicazione con vCenter: ' + username, {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });
	logger.error(error);
      // Usa l'errorHandler di Backstage per una risposta standardizzata
      throw error;
    } finally {
      // 4. Logout dalla sessione di vCenter
      if (apiToken) {
        await axios.delete(`${apiUrl}/rest/com/vmware/cis/session`, {
          headers: { 'vmware-api-session-id': apiToken },
          httpsAgent: agent,
        });
        logger.info('Sessione vCenter terminata correttamente.');
      }
      return folders;
    }
  };

  return {
    async getStoragePolicies() {
      return await doVSphereQuery({query: '/rest/vcenter/storage/policies', queryFilter: null});
    },

    async getResourcePools(filter: string ) {
      return await doVSphereQuery({query: '/rest/vcenter/resource-pool', queryFilter: filter});
    },

    async getDatacenters(request: { id: string }) {
      return await doVSphereQuery({query: '/rest/vcenter/datacenter', queryFilter: null});
    },

    async getNetworks(filter: string) {
      return await doVSphereQuery({query: '/rest/vcenter/network', queryFilter: filter});
    },

  };
}
