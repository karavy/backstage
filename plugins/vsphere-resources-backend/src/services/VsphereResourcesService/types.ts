import {
  BackstageCredentials,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';

// Definiamo le interfacce come prima
export interface VCenterFolder {
  folder: string;
  name: string;
  type: 'VIRTUAL_MACHINE' | 'HOST' | 'DATASTORE' | 'NETWORK';
}

export interface VCenterFolderResponse {
  value: VCenterFolder[];
}


