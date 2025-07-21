import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import express from 'express';
import Router from 'express-promise-router';
import axios, { AxiosError } from 'axios';
import https from 'https';
import { VCenterFolder, VCenterFolderResponse } from './types';

// Opzioni che il nostro router riceverà dall'ambiente Backstage
export interface RouterOptions {
  logger: Logger;
  config: Config;
}

// Funzione principale che crea il router
export async function getVSphereFolder(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  // Leggiamo la configurazione specifica per vCenter
  const vcenterConfig = config.getConfig('vcenter');
  const apiUrl = vcenterConfig.getString('apiUrl');
  const username = vcenterConfig.getString('username');
  const password = vcenterConfig.getString('password');
  
  // Per lo sviluppo, potremmo voler ignorare i certificati self-signed
  // ATTENZIONE: Non usare 'rejectUnauthorized: false' in produzione!
  const agent = new https.Agent({
    rejectUnauthorized: false, 
  });

  const router = Router();
  router.use(express.json());

  // Definizione della rotta per ottenere le folder
  router.get('/folders', async (req, res) => {
    const filterQuery = req.query.filter as string | undefined;
    logger.info(`Inizio richiesta folder da vCenter, filtro: "${filterQuery}"`);

    let apiToken: string | null = null;

    try {
      // 1. Autenticazione per ottenere il token
      const authResponse = await axios.post(
        `${apiUrl}/com/vmware/cis/session`,
        {},
        {
          auth: { username, password },
          httpsAgent: agent,
        },
      );
      apiToken = authResponse.data.value;

      // 2. Recupero delle folder
      const folderResponse = await axios.get<VCenterFolderResponse>(
        `${apiUrl}/vcenter/folder`,
        {
          headers: { 'vmware-api-session-id': apiToken! },
          httpsAgent: agent,
        },
      );
      let folders = folderResponse.data.value;

      // 3. Filtro lato server
      if (filterQuery) {
        folders = folders.filter(folder =>
          folder.name.toLowerCase().includes(filterQuery.toLowerCase()),
        );
      }

      res.status(200).json(folders);
    } catch (error) {
      const axiosError = error as AxiosError;
      logger.error('Errore durante la comunicazione con vCenter', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });
      // Usa l'errorHandler di Backstage per una risposta standardizzata
      throw error;
    } finally {
      // 4. Logout dalla sessione di vCenter
      if (apiToken) {
        await axios.delete(`${apiUrl}/com/vmware/cis/session`, {
          headers: { 'vmware-api-session-id': apiToken },
          httpsAgent: agent,
        });
        logger.info('Sessione vCenter terminata correttamente.');
      }
    }
  });

  // Aggiungiamo l'errorHandler di Backstage per gestire gli errori
  router.use(errorHandler());
  return router;
}
