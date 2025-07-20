// file: steps/SummaryStep.tsx

import React from 'react';
import { Box, Typography, Grid, Chip } from '@material-ui/core';
import { InfoCard, Table, TableColumn } from '@backstage/core-components';
import { WizardFormData } from '../ExampleComponent'; // Assicurati che il percorso sia corretto

interface ProfileOption {
  profilekey: string;
  profilevalue: string;
}

interface SummaryStepProps {
  formData: WizardFormData;
  profileOptions: ProfileOption[];
}

// Un piccolo componente helper per visualizzare coppie chiave-valore
const KeyValue = ({ label, value }: { label: string; value: any }) => (
  <>
    <Grid item xs={12} sm={4}>
      <Typography variant="subtitle2">{label}</Typography>
    </Grid>
    <Grid item xs={12} sm={8}>
      <Typography variant="body2" color="textSecondary">{value || '-'}</Typography>
    </Grid>
  </>
);

export const SummaryStep = ({ formData, profileOptions }: SummaryStepProps) => {
  // Definisci le colonne per la tabella dei nodi
  const ipamColumns: TableColumn[] = [
    { title: 'Nome', field: 'ipamname' },
    { title: 'Prefisso', field: 'prefix' },
    { title: 'Gateway', field: 'gateway' },
    { title: 'Primo Indirizzo', field: 'rangestart' },
    { title: 'Ultimo Indirizzo', field: 'rangeend' },
  ];

  const nodeColumns: TableColumn[] = [
    { title: 'Nome', field: 'nodename' },
    { title: 'Repliche', field: 'replicas' },
    { title: 'CPU', field: 'cpu' },
    { title: 'RAM (MB)', field: 'mbram' },
    { title: 'Disco (GB)', field: 'gbdisk' },
    { title: 'VM DC Folder', field: 'dcfolder' },
    { title: 'VM DC Pool', field: 'dcpool' },
    { title: 'VM DC Storage', field: 'dcstorage' },
    { title: 'VM Template', field: 'dcvmtemplate' },
    { title: 'VM DC Network', field: 'dcnetwork' },
    {
      title: 'Labels',
      // Usiamo una funzione di render custom per visualizzare l'array di etichette
      render: (rowData: any) => (
        <Box display="flex" flexWrap="wrap" gridGap={4}>
          {rowData.nodelabels?.map((label: any) => (
            <Chip key={label.labelkey} label={`${label.labelkey}=${label.labelvalue}`} size="small" />
          ))}
        </Box>
      ),
    },
    {
      title: 'Taints',
      // Usiamo una funzione di render custom per visualizzare l'array di etichette
      render: (rowData: any) => (
        <Box display="flex" flexWrap="wrap" gridGap={4}>
          {rowData.nodetaints?.map((taint: any) => (
            <Chip key={taint.taintkey} label={`${taint.taintkey}=${taint.taintvalue}`} size="small" />
          ))}
        </Box>
      ),
    },
  ];

  const selectedProfileValues = formData.profilelabels?.map(key => {
    const option = profileOptions.find(opt => opt.profilekey === key);
    return option ? option.profilevalue : key; // Mostra la chiave se non trova il valore
  }) || [];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Riepilogo dei Dati Inseriti
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Controlla che tutti i valori siano corretti prima di procedere.
      </Typography>

      {/* Card per le informazioni principali */}
      <InfoCard title="Informazioni Principali" style={{ marginTop: '16px' }}>
        <Grid container spacing={2}>
          <KeyValue label="Nome Cluster" value={formData.clustername} />
          <KeyValue label="Dominio Cluster" value={formData.clusterdomain} />
          <KeyValue label="IP API Server" value={formData.apiserverip} />
          <KeyValue label="Repliche Control Plane" value={formData.cpreplicas} />
          <KeyValue label="Versione Kubernetes" value={formData.k8sversion} />
        </Grid>
      </InfoCard>

      <InfoCard title="Informazioni vSphere" style={{ marginTop: '16px' }}>
        <Grid container spacing={2}>
          <KeyValue label="Datacenter Name" value={formData.dcname} />
          <KeyValue label="Datacenter URL" value={formData.dcurl} />
          <KeyValue label="Certificate Thumbprint" value={formData.dcthumbprint} />
          <KeyValue label="Datacenter Credential Secret" value={formData.dccred} />
        </Grid>
      </InfoCard>

      <InfoCard title="Definizione Range IPAM" style={{ marginTop: '16px' }}>
        <Table
          title="Definizione Pool"
          options={{ search: false, paging: false, toolbar: false }}
          columns={ipamColumns}
          data={formData.ipampool}
        />
      </InfoCard>

      {/* Card e Tabella per le informazioni sui nodi */}
      <InfoCard title="Definizione Nodi Tenant" style={{ marginTop: '16px' }}>
        <Table
          title="Nodi da Creare"
          options={{ search: false, paging: false, toolbar: false }}
          columns={nodeColumns}
          data={formData.nodesinfo}
        />
      </InfoCard>
      
      <InfoCard title="Profili Selezionati" style={{ marginTop: '16px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {selectedProfileValues.length > 0 ? (
              <Box display="flex" flexWrap="wrap" gridGap={8}>
                {selectedProfileValues.map(value => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">-</Typography>
            )}
          </Grid>
        </Grid>
      </InfoCard>

    </Box>
  );
};
