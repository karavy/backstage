// file: steps/SummaryStep.tsx

import React from 'react';
import { Box, Typography, Grid, Chip } from '@material-ui/core';
import { InfoCard, Table, TableColumn } from '@backstage/core-components';
import { WizardFormData } from '../ExampleComponent'; // Assicurati che il percorso sia corretto

interface SummaryStepProps {
  formData: WizardFormData;
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

export const SummaryStep = ({ formData }: SummaryStepProps) => {
  // Definisci le colonne per la tabella dei nodi
  const nodeColumns: TableColumn[] = [
    { title: 'Nome', field: 'nodename' },
    { title: 'Repliche', field: 'replicas' },
    { title: 'CPU', field: 'cpu' },
    { title: 'RAM (MB)', field: 'mbram' },
    { title: 'Disco (GB)', field: 'gbdisk' },
    {
      title: 'Etichette',
      // Usiamo una funzione di render custom per visualizzare l'array di etichette
      render: (rowData: any) => (
        <Box display="flex" flexWrap="wrap" gridGap={4}>
          {rowData.nodelabels?.map((label: any) => (
            <Chip key={label.labelkey} label={`${label.labelkey}=${label.labelvalue}`} size="small" />
          ))}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Riepilogo dei Dati Inseriti
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Controlla che tutti i valori siano corretti prima di procedere.
      </Typography>

      {/* Card per le informazioni principali */}
      <InfoCard title="Informazioni Principali e vSphere" style={{ marginTop: '16px' }}>
        <Grid container spacing={2}>
          <KeyValue label="Nome Cluster" value={formData.clustername} />
          <KeyValue label="Dominio Cluster" value={formData.clusterdomain} />
          <KeyValue label="IP API Server" value={formData.apiserverip} />
          <KeyValue label="Repliche Control Plane" value={formData.cpreplicas} />
          <KeyValue label="Versione Kubernetes" value={formData.k8sversion} />
          <KeyValue label="Datacenter vSphere" value={formData.dcname} />
        </Grid>
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
      
      {/* Aggiungi qui altre card e tabelle per gli altri dati, es. ipampool */}

    </Box>
  );
};
