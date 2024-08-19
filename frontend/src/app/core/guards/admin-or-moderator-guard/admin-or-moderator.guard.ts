import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

export const adminOrModeratorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  if(userRole === 'admin' || userRole === 'moderator')
    return true;

  return router.createUrlTree(['/']);
};

