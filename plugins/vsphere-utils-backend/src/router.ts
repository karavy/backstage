import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { z } from 'zod';
import express from 'express';
import Router from 'express-promise-router';
import { TodoListService } from './services/TodoListService/types';

export async function createRouter({
  httpAuth,
  todoListService,
}: {
  httpAuth: HttpAuthService;
  todoListService: TodoListService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  // TEMPLATE NOTE:
  // Zod is a powerful library for data validation and recommended in particular
  // for user-defined schemas. In this case we use it for input validation too.
  //
  // If you want to define a schema for your API we recommend using Backstage's
  // OpenAPI tooling: https://backstage.io/docs/next/openapi/01-getting-started
  const todoSchema = z.object({
    title: z.string(),
    entityRef: z.string().optional(),
  });

  router.get('/resourcepool/:filter', async (req, res) => {
    res.json(await todoListService.getResourcePools(req.params.filter));
  });

  router.get('/folder/:dcurl/:filter', async (req, res) => {
    const result = await todoListService.getFolders({ id: req.params.filter, dcurl: req.params.dcurl });

    res.status(201).json(result);
  });

  router.get('/datacenter/:dcurl', async (req, res) => {
    const result = await todoListService.getDatacenters({ id: req.params.id, dcurl: req.params.dcurl });

    res.status(201).json(result);
  });

  router.get('/storagepolicies', async (req, res) => {
    res.json(await todoListService.getStoragePolicies());
  });

  router.get('/networks/:filter', async (req, res) => {
    res.json(await todoListService.getNetworks(req.params.filter));
  });

  return router;
}
