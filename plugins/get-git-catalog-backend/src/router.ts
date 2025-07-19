import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { z } from 'zod';
import express from 'express';
import Router from 'express-promise-router';
import { TodoListService } from './services/TodoListService/types';

import express from 'express';
import simpleGit from 'simple-git';
import fs from 'fs/promises';
import yaml from 'yaml';
import path from 'path';

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

  router.get('/todos', async (_req, res) => {
    res.json(await todoListService.listTodos());
  });

  router.get('/todos/:id', async (req, res) => {
    res.json(await todoListService.getTodo({ id: req.params.id }));
  });

  router.get('/entity-yaml', async (req, res) => {
    const gitToken = req.headers['x-clastix-gittoken']
    const gitRepo = req.headers['x-clastix-repo']
console.log(gitToken)
    const repoUrl = "https://nouser:" + gitToken + "@github.com/karavy/" + gitRepo as string;
    const tmpDir = path.join('/tmp/', Date.now().toString());

    try {
      const git = simpleGit();
      await git.clone(repoUrl, tmpDir);
      const content = await fs.readFile(path.join(tmpDir + "/output", 'params.yaml'), 'utf-8');
      const parsed = yaml.parse(content);
      res.json(parsed);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}

