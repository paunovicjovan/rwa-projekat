import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.interface';

export const loadUserProfile = createAction(
  '[Users] Load User Profile',
  props<{ userId: number }>()
);

export const loadUserProfileSuccess = createAction(
  '[Users] Load User Profile Success',
  props<{ loadedUser: User }>()
);

export const loadUserProfileFailure = createAction(
  '[Users] Load User Profile Failure'
);
