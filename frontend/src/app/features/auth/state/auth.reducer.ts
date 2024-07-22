import { createReducer, on } from "@ngrx/store";
import { AuthState } from "../models/auth-state.interface";
import * as authActions from './auth.actions'

export const initialState: AuthState = {
    isLoading: false,
    currentUser: undefined,
    token: null,
    error: null
}

export const authReducer = createReducer(
    initialState,
    on(authActions.login, state => {
        return {
            ...state, 
            isLoading: true,
            error: null
        }
    }),
    on(authActions.loginSuccess, (state, action) => {
        return {
            ...state, 
            isLoading: false, 
            currentUser: action.currentUser, 
            token: action.token
        }
    }),
    on(authActions.loginFailure, (state, action) => {
        return {
            ...state,
            isLoading: false,
            error: action.error
        }
    })
)