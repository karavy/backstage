import { postgresqlCnpgPlugin } from './plugin';

describe('postgresql-cnpg', () => {
  it('should export plugin', () => {
    expect(postgresqlCnpgPlugin).toBeDefined();
  });
});
