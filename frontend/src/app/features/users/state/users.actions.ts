import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.interface';
import { FilterUsersRequest } from '../models/filter-users-request.interface';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';

export const loadUserProfile = createAction(
  '[Users] Load User Profile',
  props<{ username: string }>()
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
  props<{ paginatedUsers: PaginatedResponse<User> }>()
)

export const filterUsersFailure = createAction(
  '[Users] Load Users Failure'
)

export const clearLoadedUsers = createAction(
  '[Users] Clear Loaded Users'
)