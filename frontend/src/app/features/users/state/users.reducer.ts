import { createReducer, on } from "@ngrx/store";
import { UsersState } from "../models/users-state.interface";
import * as usersActions from './users.actions'

export const initialState: UsersState = {
    isLoading: false,
    chosenUserProfile: null
}

export const usersReducer = createReducer(
    initialState,
    on(usersActions.loadUserProfile, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.loadUserProfileSuccess, (state, action)=>{
        return {
            isLoading: false,
            chosenUserProfile: action.loadedUser
        }
    }),
    on(usersActions.loadUserProfileFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    })
)