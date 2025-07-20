import React, { useState } from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { useApi, scaffolderApiRef } from '@backstage/core-plugin-api';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Grid,
  CircularProgress,
  Typography,
} from '@material-ui/core';

export const CreateAppPage = () => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [cpu, setCpu] = useState('');
  const [memory, setMemory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const { taskId } = await scaffolderApi.scaffold({
        templateRef: 'default:component/crea-servizio',
        values: {
          name,
          cpu,
          memory,
        },
      });
      navigate(`/create/tasks/${taskId}`);
    } catch (err) {
      console.error('Errore nel lancio del template:', err);
      setLoading(false);
    }
  };

  return (
    <Page themeId="tool">
      <Header title="Crea una nuova applicazione" />
      <Content>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome applicazione"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="CPU"
              value={cpu}
              onChange={e => setCpu(e.target.value)}
              placeholder="es. 500m"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Memoria"
              value={memory}
              onChange={e => setMemory(e.target.value)}
              placeholder="es. 512Mi"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Crea'}
            </Button>
          </Grid>
        </Grid>
        <Typography variant="body2" style={{ marginTop: 16 }}>
          Verrà lanciato il template <code>default:component/crea-servizio</code>
        </Typography>
      </Content>
    </Page>
  );
};

