import React from 'react';
import { TextField, Box, Typography } from '@material-ui/core';
import { Controller, Control } from 'react-hook-form'; // Importa Control e Controller
import { makeStyles } from '@material-ui/core/styles';
import { WizardFormData } from '../ExampleComponent';

interface ClusterMainInfoProps {
  control: Control<WizardFormData>;
}

const useStyles = makeStyles(theme => ({
  customTextField: {
    margin: theme.spacing(1),
    width: '50ch', // Imposta una larghezza
    backgroundColor: theme.palette.background.default, // Cambia lo sfondo
  },
}));

export const ClusterMainInfo = ({ control }: ClusterMainInfoProps) => {
  const classes = useStyles();  

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Dettagli del Servizio
      </Typography>

      {/* 3. Ogni TextField è ora avvolto da un Controller */}
     <Controller
        name="contract"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nome del Contratto"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '24px' }}
          />
        )}
     />

     <Controller
        name="clustername"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nome del Cluster"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '24px' }}
          />
        )}
     />

      <Controller
        name="gatewayip"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Internal Cluster API Server IP"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '24px' }}
          />
        )}
      />

      <Controller
        name="clusterdomain"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Dominio del cluster tenant"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '24px' }}
          />
        )}
      />

      <Controller
        name="apiserverip"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Indirizzo apiserver del cluster tenant"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '24px' }}
          />
        )}
      />

      <Controller
        name="cpreplicas"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            // Gestisce la conversione del valore da stringa a numero
            onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
            label="Numero repliche controlplane"
            type="number"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '24px' }}
          />
        )}
      />

      <Controller
        name="datastore"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nome datastore servizi Kamaji"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '24px' }}
          />
        )}
      />

      <Controller
        name="k8sversion"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Versione Kubernetes"
            variant="outlined"
            fullWidth
            style={{ marginBottom: '24px' }}
          />
        )}
      />
    </Box>
  );
};
