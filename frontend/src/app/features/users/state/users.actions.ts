import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.interface';
import { FilterUsersRequest } from '../models/filter-users-request.interface';

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

export const filterUsers = createAction(
  '[Users] Load Users',
  props<{ filterData: FilterUsersRequest }>()
)

export const filterUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>() //mozda treba da se menja ovde kad se napravi paginacija (zbog metadata)
)

export const filterUsersFailure = createAction(
  '[Users] Load Users Failure'
)