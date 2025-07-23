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

  router.post('/todos', async (req, res) => {
    const parsed = todoSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InputError(parsed.error.toString());
    }

    const result = await todoListService.createTodo(parsed.data, {
      credentials: await httpAuth.credentials(req, { allow: ['user'] }),
    });

    res.status(201).json(result);
  });

  router.get('/resourcepool/:filter', async (req, res) => {
    res.json(await todoListService.getResourcePools(req.params.filter));
  });

  router.get('/datacenter', async (req, res) => {
    res.json(await todoListService.getDatacenters({ id: req.params.id }));
  });

  router.get('/storagepolicies', async (req, res) => {
    res.json(await todoListService.getStoragePolicies());
  });

  router.get('/networks/:filter', async (req, res) => {
    res.json(await todoListService.getNetworks(req.params.filter));
  });

  return router;
}
