import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { MenuItem, TextField, Button, Box, IconButton, Paper, FormControl, InputLabel, Select } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';

interface IpamPoolStepProps {
  control: Control<WizardFormData>;
}

export const IpamPoolStep = ({ control, prefixOptions }: IpamPoolStepProps) => {

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ipampool',
  });

  return (
    <Box>
      {fields.map((item, index) => (
        <Paper name="ipampaper" key={item.id} style={{ padding: '16px', marginBottom: '16px' }} variant="outlined">
          <Box display="flex" alignItems="center">
            <Controller
              name={`ipampool.${index}.ipamname`}
              control={control}
	      defaultValue={item.ipamname}
              render={({ field }) => (
                <TextField {...field} label="Nome Pool" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />

	    <Controller
              name={`ipampool.${index}.prefix`}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth style={{ flex: 1, margin: '16px' }}>
                  <InputLabel id="prefix-select-label">Prefisso IPAM</InputLabel>
                  <Select
                    {...field}
                    labelId="prefix-select-label"
                    label="Prefisso IPAM pool"
                    style={{ flex: 1, marginBottom: '16px' }}
                  >
                    {prefixOptions != null && prefixOptions.map(prefix => (
                      <MenuItem key={prefix} value={prefix}>{prefix}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
	    />
            <Controller
              name={`ipampool.${index}.gateway`}
              control={control}
	      defaultValue={item.gateway}
              render={({ field }) => (
                <TextField {...field} label="Gateway Pool" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
            <Controller
              name={`ipampool.${index}.rangestart`}
              control={control}
	      defaultValue={item.rangestart}
              render={({ field }) => (
                <TextField {...field} label="Range First Address" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
            <Controller
              name={`ipampool.${index}.rangeend`}
              control={control}
	      defaultValue={item.rangeend}
              render={({ field }) => (
                <TextField {...field} label="Range Last Address" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
            <IconButton onClick={() => remove(index)}><DeleteIcon /></IconButton>
          </Box>
        </Paper>
      ))}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => append({})}
      >
        Aggiungi IPAM Pool
      </Button>
    </Box>
  );
};
