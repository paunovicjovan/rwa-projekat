import { ReviewAuthorOrAdminGuard } from "./review-author-or-admin.guard";

describe('ReviewAuthorOrAdminGuard', () => {
  it('should be defined', () => {
    expect(new ReviewAuthorOrAdminGuard()).toBeDefined();
  });
});
