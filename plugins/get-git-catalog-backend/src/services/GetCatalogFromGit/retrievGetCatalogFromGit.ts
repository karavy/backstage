import { LoggerService } from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import crypto from 'node:crypto';
import { TodoItem, TodoListService } from './types';

// TEMPLATE NOTE:
// This is a simple in-memory todo list store. It is recommended to use a
// database to store data in a real application. See the database service
// documentation for more information on how to do this:
// https://backstage.io/docs/backend-system/core-services/database
export async function retrievGetCatalogFromGit({
  logger,
  catalog,
}: {
  logger: LoggerService;
  catalog: typeof catalogServiceRef.T;
}): Promise<TodoListService> {
    const gitToken = req.headers['x-clastix-gittoken']
    const gitRepo = req.headers['x-clastix-repo']
    const repoUrl = "https://nouser:" + gitToken + "@github.com/karavy/" + gitRepo as string;
    const tmpDir = path.join('/tmp', Date.now().toString());

    try {
      const git = simpleGit();
      await git.clone(repoUrl, tmpDir);
      const content = await fs.readFile(path.join(tmpDir, 'catalog-info.yaml'), 'utf-8');
      const parsed = yaml.parse(content);
      res.json(parsed);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }

