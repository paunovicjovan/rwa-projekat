import { createReducer, on } from "@ngrx/store";
import { AuthState } from "../models/auth-state.interface";
import * as authActions from './auth.actions';
import * as usersActions from '../../users/state/users.actions';

export const initialState: AuthState = {
    isSubmitting: false,
    currentLoggedInUser: undefined,
    token: null,
    errorMessage: null
}

export const authReducer = createReducer(
    initialState,
    on(authActions.login, state => {
        return {
            ...state, 
            isSubmitting: true,
            errorMessage: null
        }
    }),
    on(authActions.loginSuccess, (state, action) => {
        return {
            ...state, 
            isSubmitting: false, 
            currentLoggedInUser: action.currentUser, 
            token: action.token
        }
    }),
    on(authActions.loginFailure, (state, action) => {
        return {
            ...state,
            isSubmitting: false,
            errorMessage: action.errorMessage
        }
    }),
    on(authActions.register, state => {
        return {
            ...state, 
            isSubmitting: true,
            errorMessage: null
        }
    }),
    on(authActions.registerSuccess, (state, action) => {
        return {
            ...state, 
            isSubmitting: false, 
            currentLoggedInUser: action.currentUser, 
            token: action.token
        }
    }),
    on(authActions.registerFailure, (state, action) => {
        return {
            ...state,
            isSubmitting: false,
            errorMessage: action.errorMessage
        }
    }),
    on(authActions.logout, (state) => {
        return {
            ...state,
            currentLoggedInUser: null,
            token: null
        }
    }),
    on(authActions.clearErrors, (state) => {
        return {
            ...state,
            errorMessage: null
        }
    }),
    on(usersActions.changeUserProfileImageSuccess, (state, action) => {
        return {
            ...state,
            currentLoggedInUser: action.user
        }
    }),
    on(usersActions.updateUserDataSuccess, (state, action) => {
        return {
            ...state,
            currentLoggedInUser: action.user
        }
    })
)