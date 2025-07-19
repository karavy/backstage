import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { TextField, Button, Box, IconButton, Paper, FormControl, Grid, Typography } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';

interface NodeLabelsProps {
  control: Control<WizardFormData>;
  nodeIndex: number;
}

export const NodeLabels = ({ control, nodeIndex }: NodeLabelsProps) => {
  const { fields: nodeLabelsFields, append: appendNodeLabels, remove: removeNodeFields } = useFieldArray({
    control,
    name: `nodesinfo.${nodeIndex}.nodelabels`,
  });

  return (
    <Box>
      {nodeLabelsFields.map((labelItem, labelIndex) => (
        <Paper name="nodepaper" key={labelItem.id} style={{ padding: '16px', marginBottom: '16px' }} variant="outlined">
        {/*<Box alignItems="center">*/}
        <Typography  variant="h6" gutterBottom >Node Label {labelIndex}</Typography>
	<Grid container spacing={3}>
          <Grid item xs={12}>
	    <Controller
	    fullWidth
              name={`nodesinfo.${nodeIndex}.nodelabels.${labelIndex}.labelkey`}
              control={control}
	      defaultValue={labelItem.labelkey}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Node Label Key" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={12}>
	    <Controller
	    fullWidth
              name={`nodesinfo.${nodeIndex}.nodelabels.${labelIndex}.labelvalue`}
              control={control}
	      defaultValue={labelItem.labelvalue}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Node Label Value" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={12}>
            <IconButton onClick={() => removeNodeLabel(index)}><DeleteIcon /></IconButton>
	  </Grid>
	</Grid>
	</Paper>
      ))}      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => appendNodeLabels()}
      >
        Aggiungi Label
      </Button>


    </Box>
  );
};

interface NodeTaintsProps {
  control: Control<WizardFormData>;
  nodeIndex: number;
}

export const NodeTaints = ({ control, nodeIndex }: NodeTaintsProps) => {
  const { fields: nodeTaintsFields, append: appendNodeTaints, remove: removeNodeFields } = useFieldArray({
    control,
    name: `nodesinfo.${nodeIndex}.nodetaints`,
  });

  return (
    <Box>
      {nodeTaintsFields.map((taintItem, taintIndex) => (
        <Paper name="nodepaper" key={taintItem.id} style={{ padding: '16px', marginBottom: '16px' }} variant="outlined">
        {/*<Box alignItems="center">*/}
        <Typography  variant="h6" gutterBottom >Node Taint {taintIndex}</Typography>
	<Grid container spacing={3}>
          <Grid item xs={12}>
	    <Controller
	    fullWidth
              name={`nodesinfo.${nodeIndex}.nodetaints.${taintIndex}.taintkey`}
              control={control}
	      defaultValue={taintItem.taintkey}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Node Taint Key" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={12}>
	    <Controller
	    fullWidth
              name={`nodesinfo.${nodeIndex}.nodetaintss.${taintIndex}.taintvalue`}
              control={control}
	      defaultValue={taintItem.taintvalue}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Node Taint Value" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={12}>
            <IconButton onClick={() => removeNodeTaint(index)}><DeleteIcon /></IconButton>
	  </Grid>
	</Grid>
	</Paper>

      ))}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => appendNodeTaints()}
      >
        Aggiungi Taint
      </Button>

   </Box>
  );
};


interface NodesInfoStepProps {
  control: Control<WizardFormData>;
}

export const NodesInfoStep = ({ control }: NodesInfoStepProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'nodesinfo',
  });

  return (
    <Box>
      {fields.map((item, index) => (
        <Paper name="nodepaper" key={item.id} style={{ padding: '16px', marginBottom: '16px' }} variant="outlined">
	{/*<Box alignItems="center">*/}
	<Grid container >
	  <Grid >
            <Typography  variant="h6" gutterBottom >Node Type {index}</Typography>	
	  </Grid>
	  <Grid >
            <IconButton onClick={() => remove(index)}><DeleteIcon /></IconButton>
	  </Grid>
	</Grid>
	<Grid container spacing={3}>
          <Grid item xs={12}>
	    <Controller
	    fullWidth
              name={`nodesinfo.${index}.nodename`}
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Node Type Name" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={3}>
	    <Controller
              name={`nodesinfo.${index}.replicas`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Node Replicas" variant="outlined" style={{ flex: 1, margin: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={3}>
	    <Controller
              name={`nodesinfo.${index}.cpu`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Node CPU" variant="outlined" style={{ flex: 1, margin: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={3}>
            <Controller
              name={`nodesinfo.${index}.mbram`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Node RAM (MB)" variant="outlined" style={{ flex: 1, margin: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={3}>
            <Controller
              name={`nodesinfo.${index}.gbdisk`}
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Node Disk Size (GB)" variant="outlined" style={{ flex: 1, margin: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={12}>
            <Controller
              name={`nodesinfo.${index}.dcfolder`}
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Datacenter Node Folder" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={12}>
            <Controller
              name={`nodesinfo.${index}.dcpool`}
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Datacenter Node Pool" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={12}>
            <Controller
              name={`nodesinfo.${index}.dcstorage`}
              control={control}
              render={({ field }) => (
                <TextField {...field}  fullWidth label="Datacenter Node Storage" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={12}>
            <Controller
              name={`nodesinfo.${index}.dcvmtemplate`}
              control={control}
              render={({ field }) => (
                <TextField {...field}  fullWidth label="Datacenter Node VM Template" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={12}>
            <Controller
              name={`nodesinfo.${index}.dcnetwork`}
              control={control}
              render={({ field }) => (
                <TextField {...field}  fullWidth label="Datacenter Node Network" variant="outlined" style={{ flex: 1, marginRight: '16px' }} />
              )}
            />
	  </Grid>
          <Grid item xs={6}>
	    <NodeLabels control={control} nodeIndex={index} />
	  </Grid>
          <Grid item xs={6}>
	    <NodeTaints control={control} nodeIndex={index} />
	  </Grid>
	  </Grid>
        </Paper>
      ))}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => append()}
      >
        Aggiungi Tipo Nodo
      </Button>
    </Box>
  );
};
