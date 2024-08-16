import { HttpInterceptorFn } from '@angular/common/http';
import { AuthState } from '../../features/auth/models/auth-state.interface';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { Features } from '../../features/features.enum';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const authState: AuthState = localStorageService.get(Features.Auth) as AuthState;

  if (authState.token !== null) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authState.token}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
