import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../models/auth-state.interface';
import { Features } from '../../features.enum';

export const authFeature = createFeatureSelector<AuthState>(Features.Auth);

export const selectAuthError = createSelector(
  authFeature,
  (state: AuthState) => state.error
);

export const selectIsLoading = createSelector(
    authFeature,
    (state: AuthState) => state.isLoading
);