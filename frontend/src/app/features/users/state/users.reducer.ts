import { createReducer, on } from "@ngrx/store";
import { UsersState } from "../models/users-state.interface";
import * as usersActions from './users.actions'
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { User } from "../models/user.interface";

export const initialState: UsersState = {
    ids: [],
    entities: {},
    isLoading: false,
    chosenUserProfile: null
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export const usersReducer = createReducer(
    initialState,
    on(usersActions.loadUserProfile, (state)=>{
        return {
            ...state,
            isLoading: true,
            chosenUserProfile: null
        }
    }),
    on(usersActions.loadUserProfileSuccess, (state, action)=>{
        return {
            ...state,
            isLoading: false,
            chosenUserProfile: action.loadedUser
        }
    }),
    on(usersActions.loadUserProfileFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.filterUsers, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.filterUsersSuccess, (state, action)=>{
        return usersAdapter.setAll(action.users, {...state, isLoading: false})
    }),
    on(usersActions.filterUsersFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    })
)