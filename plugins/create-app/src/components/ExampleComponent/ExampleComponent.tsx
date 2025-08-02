import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@material-ui/core';
import { Page, Header, Content, Progress } from '@backstage/core-components';
import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

// Importa i componenti dei singoli step
import { IpamPoolStep } from './steps/IpamPoolStep';
import { SummaryStep } from './steps/SummaryStep';
import { ClusterMainInfo } from './steps/ClusterMainInfo';
import { VSphereDcInfo } from './steps/VSphereDcInfo';
import { NodesInfoStep} from './steps/NodesInfoStep';
import { ProfilesStep } from './steps/ProfilesStep';

import { useApi, fetchApiRef } from '@backstage/core-plugin-api'; // 2. Importa le API di Backstage

import { loadInitialFormData } from './api/initialDataApi';
import { fetchDatacenterOptions, fetchPoolOptions } from './api/getVsphereData';

const profileOptions = [
  { profilekey: 'fortigate:fabric', profilevalue: 'fabric' },
  { profilekey: 'loadbalancer:metallb', profilevalue: 'metallb' },
  { profilekey: 'nfs:storage', profilevalue: 'storage' },
  { profilekey: 'cd:argocd', profilevalue: 'argocd' },
  { profilekey: 'monitoring:persistent', profilevalue: 'persistent' },
  { profilekey: 'nginx-management:ingress', profilevalue: 'ingress' },
  { profilekey: 'nginx-prod:ingress', profilevalue: 'ingress' },
  { profilekey: 'letsencrypt:external-dns', profilevalue: 'external-dns' },
  { profilekey: 'dinova-letsencypt:cert-manager', profilevalue: 'cert-manager' },
];

// Definiamo un tipo per l'intero stato del nostro form
export interface WizardFormData {
  // Primo step
  contract: string;
  clustername: string;
  clusterdomain: string;
  apiserverip: string;
  cpreplicas: number;
  datastore: string;
  k8sversion: string;
  gatewayip: string

  // secondo step
  dcname: string;
  dcurl: string;
  dcthumbprint: string;
  dccredsecret: string;

  dcfolder: string;
  dcpool: string;
  dcstorage: string;
  dcvmtemplate: string;
  dcnetwork: string;

  ipampool: { 
    ipamname: string;
    prefix: number;
    gateway: string;
    rangestart: string;
    rangeend: string;
  }[];

  profilelabels: string[];

  nodesinfo: {
    nodename: string;
    replicas: number;
    cpu: number;
    mbram: number;
    gbdisk: number;
    nodelabels: {
      labelkey: string;
      labelvalue: string;
    }[];
    nodetaints: {
      taintkey: string;
      taintvalue: string;
    }[];
  }[];
}

const steps = ['Informazioni Principali Cluster', 'Informazione vSphere Datacenter', 'Tenant Cluster IPAM', 'Definizione Nodi Tenant', 'Profili da Abilitare', 'Riepilogo'];

export const ExampleComponent = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [gitClusterName, setGitClusterName] = useState('');
  
  const { owner, entity, type } = useParams<{ owner: string, entity: string, type: string }>();
  const fetcherLoadInitial = useApi(fetchApiRef);
  const fetcherVsphere = useApi(fetchApiRef);

  // DEPENDANT SELECT
  const [datacenterOptions, setDatacenterOptions] = useState([]);
  const [resourcepoolOptions, setResourcepoolOptions] = useState([]);
  const [folderOptions, setFolderOptions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // FINO QUI

  // Stato centrale per tutti i dati del wizard
  const { control, getValues, reset, setValue } = useForm<WizardFormData>({
    defaultValues: {
      contract: '',
      clustername: '',
      clusterdomain: '',
      apiserverip: '',
      cpreplicas: 3,
      datastore: '',
      k8sversion: '',
      gatewayip: '',

      dcname: '',
      dcurl: '',
      dcthumbprint: '',
      dccredsecret: '',
      dcfolder: '', 
      dcpool: '', 
      dcstorage: '', 
      dcvmtemplate: '', 
      dcnetwork: '',
      
      ipampool: [{ ipamname: '', prefix: 26, gateway: '', rangestart: '0.0.0.0', rangeend: '0.0.0.0' }],

      nodesinfo: [{ nodename: '', replicas: 0, cpu: 1, mbram: 4096, gbdisk: 50,  nodelabels: [] , nodetaints: []}],

      profilelabels: []
    },
  });

  useEffect(() => {
    // loadInitial Data
    if (entity && entity !== "-") {
      const initialLoad = async () => {
        setIsLoading(true);
        try {
          const formData = await loadInitialFormData(fetcherLoadInitial, owner, entity);
          reset(formData); // Popola il form con i dati ricevuti
        } catch (error) {
          console.error("Fallito il caricamento iniziale:", error);
          // Gestisci l'errore, magari con una notifica
        } finally {
          setIsLoading(false);
        }
      };
      initialLoad();
    }
  }, [fetcherLoadInitial, entity, owner, reset]);

  const dcUrlTemplate = useWatch({
    control,
    name: 'dcurl',
  });
  const dcNameTemplate = useWatch({
    control,
    name: 'dcname',
  });
  /*const dcPoolTemplate = useWatch({
    control,
    name: 'dcfolder',
  });
  const dcNetworkTemplate = useWatch({
    control,
    name: 'dcnetwork',
  });*/

  useEffect(() => {

    if (!dcUrlTemplate) {
      setDatacenterOptions([]);
      return;
    }

    const dependentLoad = async () => {
      //setIsNetworkLoading(true);
      //setNetworkError(null);
      setValue('dcname', ''); // Resetta il campo dipendente

      try {
        const options = await fetchDatacenterOptions(fetcherVsphere, dcUrlTemplate);
        setDatacenterOptions(options);
      } catch (e) {
        console.log(e);
        setDatacenterOptions([]);
      } finally {
        //setIsNetworkLoading(false);
      }
    };

    dependentLoad();
  }, [fetcherVsphere, dcUrlTemplate, setValue]);

  useEffect(() => {

    if (!dcNameTemplate) {
      setResourcepoolOptions([]);
      setFolderOptions([]);
      return;
    }

    const dependentLoad = async () => {
      //setIsNetworkLoading(true);
      //setNetworkError(null);
      setValue('dcpool', ''); // Resetta il campo dipendente
      setValue('dcfolder', '');

      try {
        const rpOptions = await fetchPoolOptions(fetcherVsphere, dcNameTemplate, dcUrlTemplate);
        setResourcepoolOptions(rpOptions);
        //const folderOptions = await fetchDatacenterOptions(fetcherVsphere, dcNameTemplate, dcUrlTemplate, "DATACENTER");
        //setFolderOptions(folderOptions);
      } catch (e) {
        console.log(e);
        setResourcepoolOptions([]);
        setFolderOptions([]);
      } finally {
        //setIsNetworkLoading(false);
      }
    };

    dependentLoad();
  }, [fetcherVsphere, dcNameTemplate, setValue]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinish = async () => {
    const values = getValues();

    // Definisci il riferimento al tuo template come registrato nel catalogo
    const templateRef = 'template:default/clastix-new-cluster';

    try {
      // Lancia il processo di scaffolding
      const { taskId } = await scaffolderApi.scaffold({
        templateRef,
        values,
      });

      // 5. Reindirizza l'utente alla pagina del task dello scaffolder
      //navigate(`/scaffolder/tasks/${taskId}`);
      //navigate(`/create/tasks/${taskId}`);

    } catch (e) {
      console.error("Errore durante l'avvio dello scaffolder:", e);
      // Qui potresti mostrare una notifica di errore
    }
  };


  const selectOptions = {
    dcUrlTemplate: dcUrlTemplate ,
    dcNameTemplate: dcNameTemplate,
    datacenterOptions: datacenterOptions,
    resourcepoolOptions: resourcepoolOptions
  }

  // Funzione per renderizzare lo step corretto
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ClusterMainInfo control={control} />;
      case 1:
        return <VSphereDcInfo control={control} selectOptions={selectOptions} dcUrlTemplate={dcUrlTemplate} datacenterOptions={datacenterOptions}/>;
      case 2:
        return <IpamPoolStep control={control} />;
      case 3:
        return <NodesInfoStep control={control} />;
      case 4:
        return <ProfilesStep control={control} options={profileOptions} />;
      case 5:
        return <SummaryStep formData={getValues()} profileOptions={profileOptions}/>;
      default:
        return 'Step Sconosciuto';
    }
  };

  if (type != "clastix") {
    return <div>Type is not valid</div>;
  }

  if (isLoading) return <Progress />

  return (
    <Page themeId="tool">
      <Header title="Wizard con Stato Condiviso" />
      <Content>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={4} mb={2}>
          {getStepContent(activeStep)}
        </Box>
        <Box>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Indietro
          </Button>
          <Button variant="contained" color="primary" onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}>
            {activeStep === steps.length - 1 ? 'Crea' : 'Avanti'}
          </Button>
        </Box>
      </Content>
    </Page>
  );
};
