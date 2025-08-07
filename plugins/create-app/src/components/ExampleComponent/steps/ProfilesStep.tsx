// file: steps/ProfilesStep.tsx

import React from 'react';
import { Controller, Control } from 'react-hook-form';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@material-ui/core';
import { WizardFormData } from '../ExampleComponent';

interface ProfileOption {
  profilekey: string;
  profilevalue: string;
}

interface ProfilesStepProps {
  control: Control<WizardFormData>;
  options: ProfileOption[];
}

export const ProfilesStep = ({ control, options }: ProfilesStepProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Seleziona Profili</Typography>
      <Controller
        name="sveltosapps"
        control={control}
        render={({ field }) => (
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Profili</InputLabel>
            <Select
              {...field}
              multiple
              label="Profili"
              // `renderValue` riceve l'array di CHIAVI selezionate
              renderValue={(selectedKeys: unknown) => (
                <Box display="flex" flexWrap="wrap" gridGap={5}>
                  {(selectedKeys as string[]).map(profilekey => {
                    // Trova l'oggetto opzione corrispondente alla chiave
                    const option = options.find(opt => opt.profilekey === profilekey);
                    // Mostra il suo valore descrittivo
                    return <Chip key={profilekey} label={profilekey} size="small" />;
                  })}
                </Box>
              )}
            >
              {/* Il menu mostra il valore, ma al click salva la chiave */}
              {options.map(option => (
                <MenuItem key={option.profilekey} value={option.profilekey}>
		  {option.profilekey}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </Box>
  );
};
