import { createTemplateAction, runCommand, parseRepoUrl } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { 
  ScmIntegrations,   
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Octokit } from 'octokit';
import path from 'path';
import { scmIntegrations } from '@backstage/integration';
import { getOctokitOptions } from './utils';
import simpleGit from "simple-git";
import fs from 'node:fs';

export const createExampleAction = (options: {
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) => {
  return createTemplateAction({
    id: 'github:createmerge',
    description: 'Runs an example action',
    schema: {
      input: z.object({
        repoUrl: z =>
	  z.string({ 
            description: 'URL del repository GitHub' 
        }),
        sourcePath: z => 
	  z.string({ 
            description: 'Percorso dei file sorgente da copiare' 
	}).optional().default('./skeleton'),
        commitMessage: z =>
	  z.string({ 
	    description: 'Messaggio di commit per aggiornamento' 
	}).optional().default('feat: Aggiornamento da template Backstage'),
        tagName: z => 
	  z.string({ 
	    description: 'Tag da applicare in caso di aggiornamento' 
	}).optional(),
      }),
    },

    async handler(ctx) {
      const { repoUrl, sourcePath, commitMessage, tagName } = ctx.input;
      const { integrations, githubCredentialsProvider } = options;
      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);
      const token = githubCredentialsProvider.providers.get('github.com').token;

      const octokitOptions = await getOctokitOptions({
        integrations,
        credentialsProvider: githubCredentialsProvider,
        auth: token,
        host,
        owner,
        repo,
      });


      const octokit = new Octokit({ 
	...octokitOptions
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

      const localPath = ctx.workspacePath + "/" + repo
      const git = simpleGit();

      if (!repoExists) {
        // --- FLUSSO 1: IL REPO NON ESISTE ---
        console.log(`Il repository ${owner}/${repo} non esiste. Verrà creato...`);
	const response = await octokit.rest.repos.createForAuthenticatedUser({
          name: "deleteme",
          description: "My first repository created with Octokit!",
          private: false, // Set to true for a private repository
        });
      }

      // Clona, applica modifiche, committa, pusha e tagga
      try {
        console.log(`Clonando ${repoUrl} in ${ctx.workspacePath}...`);
        await git.clone("https://x-oauth-basic:" + token  + "@" + host + "/" + owner + "/" + repo + ".git", localPath);
        console.log("✅ Repository clonato con successo!");
      } catch (error) {
        console.error(`❌ Errore durante il clone: ${error.message}`);
        throw error
      }

      try {
        fs.cpSync(ctx.workspacePath + "/output", localPath, { recursive: true })
	console.log("files copied");
      } catch (error) {
        console.error(`❌ Errore durante la copia: ${error.message}`);
	throw error
      }

      try {
        console.log(localPath)
        await git.cwd(localPath)
          .add('.')
          .commit('new commit')
          .addAnnotatedTag(tagName, 'tag message')
          .push('origin', 'main')
          .pushTags('origin');
      } catch (error) {
        console.log ('Error pushing: ' + error)
	throw error
      }
    },
  });
};
