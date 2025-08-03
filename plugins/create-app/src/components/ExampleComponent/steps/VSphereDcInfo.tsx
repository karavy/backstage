// Dentro il file steps/DetailsStep.tsx

import React, { useState, useEffect } from 'react';
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

export const VSphereDcInfo = ({ control, selectOptions }: VSphereDcInfoProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Dettagli del Servizio</Typography>
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
                disabled={!selectOptions.dcUrlTemplate} // Disabilitato se non c'è selezione o se sta caricando
            >
                {selectOptions.datacenterOptions != null && selectOptions.datacenterOptions.map(datacenter => (
                <MenuItem key={datacenter.value} value={datacenter.value}>{datacenter.value}</MenuItem>
	            ))}
              </Select>
            </FormControl>
	  )}
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
                disabled={!selectOptions.dcNameTemplate} // Disabilitato se non c'è selezione o se sta caricando
              >
              {selectOptions.thumbprintOptions != null && selectOptions.thumbprintOptions.map(thumbprint => (
                <MenuItem key={thumbprint.sha256} value={thumbprint.sha256}>{thumbprint.name}</MenuItem>
	      ))}
             </Select>
            </FormControl>
	  )}
	/>

        <Controller
          name="dcpool"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginBottom: '16px' }}>
              <InputLabel id="dcpool-select-label">Node Resource Pool</InputLabel>
              <Select
                {...field}
                labelId="dcpool-select-label"
                label="Node Resource Pool"
                style={{ marginBottom: '24px' }}
                disabled={!selectOptions.dcNameTemplate} // Disabilitato se non c'è selezione o se sta caricando
            >
                {selectOptions.resourcepoolOptions != null && selectOptions.resourcepoolOptions.map(resourcepool => (
                <MenuItem key={resourcepool.path} value={resourcepool.path}>{resourcepool.name}</MenuItem>
	            ))}
              </Select>
            </FormControl>)}
        />
        <Controller
          name="dcfolder"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginBottom: '16px' }}>
              <InputLabel id="dcfolder-select-label">Node VM Folder</InputLabel>
              <Select
                {...field}
                labelId="dcfolder-select-label"
                label="Node VM Folder"
                style={{ marginBottom: '24px' }}
            >
                {selectOptions.folderOptions != null && selectOptions.folderOptions.map(folder => (
                <MenuItem key={folder.path} value={folder.path}>{folder.name}</MenuItem>
	            ))}
              </Select>
            </FormControl>)}
        />
	{/* DA QUI IN POI ANCORA DA FARE */}
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
        <Controller
          name="dcstorage"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginBottom: '16px' }}>
              <InputLabel id="dcstorage-select-label">Node Storage Policy</InputLabel>
              <Select
                {...field}
                labelId="dcstorage-select-label"
                label="Node Storage Policy"
                style={{ marginBottom: '24px' }}
            >
                <MenuItem value="/EDA - Datacenter Elogic A - Produzione/vm/Kubernetes Environments/CNT.24.0238.04 - VDC KUBERNETES MAGGIOLI SORIS">VDC KUBERNETES MAGGIOLI SORIS</MenuItem>
              </Select>
            </FormControl>)}
        />
        <Controller
          name="dcvmtemplate"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginBottom: '16px' }}>
              <InputLabel id="dcvmtemplate-select-label">Node VM Template</InputLabel>
              <Select
                {...field}
                labelId="dcvmtemplate-select-label"
                label="Node Resource Pool"
                style={{ marginBottom: '24px' }}
            >
                <MenuItem value="10.19.6.1">value1</MenuItem>
                <MenuItem value="vcenter-unknown">value1</MenuItem>
              </Select>
            </FormControl>)}
        />
        <Controller
          name="dcnetwork"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginBottom: '16px' }}>
              <InputLabel id="dcnetwork-select-label">Node Network</InputLabel>
              <Select
                {...field}
                labelId="dcnetwork-select-label"
                label="Node Network"
                style={{ marginBottom: '24px' }}
            >
                <MenuItem value="pippo">VDC KUBERNETES MAGGIOLI SORIS</MenuItem>
              </Select>
            </FormControl>)}
        />
    </Box>
  );
};
