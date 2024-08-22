import { UserIsProjectAuthorGuard } from './user-is-project-author.guard';

describe('UserIsProjectAuthorGuard', () => {
  it('should be defined', () => {
    expect(new UserIsProjectAuthorGuard()).toBeDefined();
  });
});
