import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.interface';
import { FilterUsersRequest } from '../models/filter-users-request.interface';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';
import { UserRoles } from '../models/user-roles.enum';
import { PaginationParameters } from '../../../shared/models/pagination-parameters.interface';
import { UpdateUserDto } from '../models/update-user-dto.interface';

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

export const changeUserRole = createAction(
  '[Users] Change User Role',
  props<{userId: number, newRole: UserRoles }>()
)

export const changeUserRoleSuccess = createAction(
  '[Users] Change User Role Success',
  props<{ user: User }>()
)

export const changeUserRoleFailure = createAction(
  '[Users] Change User Role Failure'
)

export const updateUserData = createAction(
  '[Users] Update User Data',
  props<{ userData: UpdateUserDto }>()
)

export const updateUserDataSuccess = createAction(
  '[Users] Update User Data Success',
  props<{ user: User }>()
)

export const updateUserDataFailure = createAction(
  '[Users] Update User Data Failure'
)

export const deleteUserAccount = createAction(
  '[Users] Delete User Account',
  props<{userId: number}>()
)

export const deleteUserAccountSuccess = createAction(
  '[Users] Delete User Account Success',
  props<{userId: number}>()
)

export const deleteUserAccountFailure = createAction(
  '[Users] Delete User Account Failure',
)

export const changeUserProfileImage = createAction(
  '[Users] Change User Profile Image',
  props<{formData: FormData}>()
)

export const changeUserProfileImageSuccess = createAction(
  '[Users] Change User Profile Image Success',
  props<{ user: User }>()
)

export const changeUserProfileImageFailure = createAction(
  '[Users] Change User Profile Image Failure',
)

export const loadAppliedUsersForProject = createAction(
  '[Users] Load Applied Users For Project',
  props<{ projectId: number, paginationOptions: PaginationParameters }>()
)

export const loadAppliedUsersForProjectSuccess = createAction(
  '[Users] Load Applied Users For Project Success',
  props<{ paginatedUsers: PaginatedResponse<User> }>()
)

export const loadAppliedUsersForProjectFailure = createAction(
  '[Users] Load Applied Users For Project Failure',
)

export const loadAcceptedUsersForProject = createAction(
  '[Users] Load Accepted Users For Project',
  props<{ projectId: number, paginationOptions: PaginationParameters }>()
)

export const loadAcceptedUsersForProjectSuccess = createAction(
  '[Users] Load Accepted Users For Project Success',
  props<{ paginatedUsers: PaginatedResponse<User> }>()
)

export const loadAcceptedUsersForProjectFailure = createAction(
  '[Users] Load Accepted Users For Project Failure',
)