import { UserIsOwnerGuard } from './user-is-owner.guard';

describe('UserIsOwnerGuard', () => {
  it('should be defined', () => {
    expect(new UserIsOwnerGuard()).toBeDefined();
  });
});
