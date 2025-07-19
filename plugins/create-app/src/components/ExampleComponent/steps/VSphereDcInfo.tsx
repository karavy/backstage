// Dentro il file steps/DetailsStep.tsx

import React from 'react';
import { Controller, Control } from 'react-hook-form';
import {
  TextField,
  Box,
  Typography,
  FormControl, // <-- Importa i componenti necessari
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';

// L'interfaccia deve includere il nuovo campo
interface VSphereDcInfoProps {
  control: Control<WizardFormData>;
}

export const VSphereDcInfo = ({ control }: VSphereDcInfoProps) => {
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Dettagli del Servizio</Typography>

      {/* INIZIO: CODICE PER IL MENU A TENDINA */}
        <Controller
          name="dcname"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginBottom: '24px' }}>
              <InputLabel id="dcname-select-label">Nome cluster vSphere</InputLabel>
              <Select
	        {...field}
          	labelId="dcname-select-label"
	        label="Nome cluster vSphere"
	        style={{ marginBottom: '24px' }}
              >
                <MenuItem value="EDA - Datacenter Elogic A - Produzione">EDA - Datacenter Elogic A - Produzione</MenuItem>
              </Select>
            </FormControl>
	  )}
	/>
        <Controller
          name="dcurl"
          control={control}
          render={({ field }) => (
	    <FormControl fullWidth style={{ marginBottom: '24px' }}>
	      <InputLabel id="dcurl-select-label">Indirizzo cluster vSphere</InputLabel>
              <Select
	        {...field}
                labelId="dcurl-select-label"
                label="Indirizzo Cluster vSphere"
                style={{ marginBottom: '24px' }}
              >
                <MenuItem value="10.19.6.1">10.19.6.1</MenuItem>
              </Select>
            </FormControl>)}
	/>
        <Controller
          name="dcthumbprint"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginBottom: '24px' }}>
              <InputLabel id="dcthumbprint-select-label">Impronta Certificato Cluster vSphere</InputLabel>
              <Select
	        {...field}
                labelId="dcthumbprint-select-label"
                label="Impronta Certificato Cluster vSphere"
                style={{ marginBottom: '24px' }}
              >
                <MenuItem value="71:5D:74:A5:C2:17:96:F8:72:6A:AF:CB:A4:46:26:F8:04:AC:19:7E:E1:A4:D3:BA:6D:62:FA:C1:1E:6F:F9:6E">EDA - Datacenter Elogic A - Produzione</MenuItem>
             </Select>
            </FormControl>)}
	/>
        <Controller
          name="dccredsecret"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginBottom: '24px' }}>
	      <InputLabel id="dccredsecret-select-label">Secret credenziali Cluster vSphere</InputLabel>
              <Select
	        {...field}
                labelId="dccredsecret-select-label"
                label="Secret credenziali Cluster vSphere"
                style={{ marginBottom: '24px' }}
              >
                <MenuItem value="vsphere-cluster-identity">vsphere-cluster-identity</MenuItem>
              </Select>
            </FormControl>)}
	 />
    </Box>
  );
};
