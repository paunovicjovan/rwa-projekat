import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../models/auth-state.interface';
import { Features } from '../../features.enum';

export const authFeature = createFeatureSelector<AuthState>(Features.Auth);

export const selectErrorMessage = createSelector(
  authFeature,
  (state: AuthState) => state.errorMessage
);

export const selectIsSubmitting = createSelector(
  authFeature,
  (state: AuthState) => state.isSubmitting
);

export const selectCurrentLoggedInUser = createSelector(
  authFeature,
  (state: AuthState) => state.currentLoggedInUser
);