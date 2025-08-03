import { parseRepoUrl } from '@backstage/plugin-scaffolder-node';
import { LoggerService } from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import crypto from 'node:crypto';
import { TodoItem, TodoListService } from './types';
import {
  DefaultGithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import path from 'path';
import simpleGit from 'simple-git';
import fs from 'fs/promises';
import yaml from 'yaml';
import { Octokit } from 'octokit';
import * as semver from 'semver';

// TEMPLATE NOTE:
// This is a simple in-memory todo list store. It is recommended to use a
// database to store data in a real application. See the database service
// documentation for more information on how to do this:
// https://backstage.io/docs/backend-system/core-services/database


export async function createTodoListService({
  logger,
  catalog,
  integrations,
  githubCredentialsProvider,
  config
}: {
  logger: LoggerService;
  catalog: typeof catalogServiceRef.T;  
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
}): Promise<TodoListService> {
  logger.info('Initializing TodoListService');

  const storedTodos = new Array<TodoItem>();
  const git = simpleGit();
  const token = githubCredentialsProvider.providers.get('github.com').token;

  async function repoExists (host: string, owner: string, repo: string) {
    //const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

    const octokit = new Octokit({
      integrations,
      credentialsProvider: githubCredentialsProvider,
      auth: token,
      host,
      owner,
      repo,
    });
  
    let repoExists = false;
    try {
      await octokit.rest.repos.get({ owner, repo });
      repoExists = true;
    } catch (e) {
      if (e.status !== 404) {
        throw e;
      }
    }

    return true;
  };

  return {
    async createTodo(req, res) {
      const tmpDir = path.join('/tmp/', Date.now().toString());

      const host = "github.com";
      const owner = req.params.owner;
      const repo = req.params.repo

      if (repoExists("github.com", owner, repo)) {
        try {
	  const repoUrl = "https://x-oauth-basic:" + token  + "@" + host + "/" + owner + "/" + repo + ".git"
  	  const remoteTagsOutput = await git.listRemote(['--tags', repoUrl]);
	  const tagNames = remoteTagsOutput
          	.split('\n')
          	.map(line => line.split('refs/tags/')[1]) // Estrae il nome del tag
          	.filter(Boolean) // Rimuove eventuali righe vuote o non valide
		.filter(name => !name.endsWith('^{}'))
		.filter(tag => {
    			return tag && !tag.endsWith('^{}') && semver.valid(tag);
  		});
	  const highestTag = tagNames.sort(semver.rcompare);

          await git.clone(repoUrl, tmpDir, ["--branch", highestTag[0]]);
          console.log("✅ Repository clonato con successo!");
          const content = await fs.readFile(path.join(tmpDir, 'params.yaml'), 'utf-8');
          const parsed = yaml.parse(content);
	  return parsed
        } catch (error) {
          console.error(`❌ Errore durante il clone: ${error.message}`);
          throw error
        }
      }
    },
  };
}
