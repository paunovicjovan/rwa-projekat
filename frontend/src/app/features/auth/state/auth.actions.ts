import { createAction, props } from "@ngrx/store";
import { LoginRequest } from "../models/login-request.interface";
import { User } from "../../users/models/user.interface";


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