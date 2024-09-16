import { createAction, props } from "@ngrx/store";
import { LoginRequest } from "../models/login-request.interface";
import { User } from "../../users/models/user.interface";
import { RegisterRequest } from "../models/register-request.interface";


export const login = createAction(
  '[Auth] Login',
  props<{ loginRequest: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ currentUser: User, token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ errorMessage: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ registerRequest: RegisterRequest }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ currentUser: User, token: string }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ errorMessage: string }>()
);

export const logout = createAction(
  '[Auth] Logout'
);

export const clearErrors = createAction(
  '[Auth] Clear Errors'
);