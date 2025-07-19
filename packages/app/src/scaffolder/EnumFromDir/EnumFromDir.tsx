//packages/app/src/scaffolder/ValidateKebabCase/ValidateKebabCaseExtension.tsx
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import React, { useEffect, useState } from 'react';
import { Select } from '@material-ui/core';
import type { FieldValidation } from '@rjsf/utils';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';

export const DynamicSelectField = ({
  onChange,
  rawErrors,
  formData,
}: FieldExtensionComponentProps<string>) => {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    // Simulazione fetch. Puoi sostituirlo con chiamata a file, API, ecc.
    const fetchOptions = async () => {
      const dirContents = await fetch('/static/templates/clastix/index.json')
        .then(res => res.json());
      setOptions(dirContents); // Assumi array di stringhe
    };

    fetchOptions();
  }, []);

  return (
    <>
      <InputLabel id="dynamic-select-label">Seleziona un template</InputLabel>
      <Select
        labelId="dynamic-select-label"
        value={formData ?? ''}
        onChange={e => onChange(e.target.value)}
        error={rawErrors?.length > 0}
      >
        {options.map(opt => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
