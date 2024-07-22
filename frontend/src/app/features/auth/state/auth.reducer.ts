import { createReducer, on } from "@ngrx/store";
import { AuthState } from "../models/auth-state.interface";
import * as authActions from './auth.actions'

export const initialState: AuthState = {
    isSubmitting: false,
    currentUser: undefined,
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
            //currentUser: action.currentUser, 
            token: action.token
        }
    }),
    on(authActions.loginFailure, (state, action) => {
        return {
            ...state,
            isSubmitting: false,
            errorMessage: action.errorMessage
        }
    })
)