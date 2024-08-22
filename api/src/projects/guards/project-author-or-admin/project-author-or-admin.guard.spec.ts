import { ProjectAuthorOrAdminGuard } from './project-author-or-admin.guard';

describe('ProjectAuthorOrAdminGuard', () => {
  it('should be defined', () => {
    expect(new ProjectAuthorOrAdminGuard()).toBeDefined();
  });
});
