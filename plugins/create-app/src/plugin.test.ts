import { createAppPlugin } from './plugin';

describe('create-app', () => {
  it('should export plugin', () => {
    expect(createAppPlugin).toBeDefined();
  });
});
