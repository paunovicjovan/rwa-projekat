import { createReducer, on } from "@ngrx/store";
import { UsersState } from "../models/users-state.interface";
import * as usersActions from './users.actions'
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { User } from "../models/user.interface";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";

const initialPaginationMetadataState : PaginationMetadata = {
    totalItems: 0,
    itemCount: 10,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1    
}

export const initialState: UsersState = {
    ids: [],
    entities: {},
    isLoading: false,
    chosenUserProfile: null,
    paginationMetadata: initialPaginationMetadataState
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
        return usersAdapter.setAll(action.paginatedUsers.items, {
            ...state, 
            isLoading: false, 
            paginationMetadata: {
                ...action.paginatedUsers.meta
            }
        })
    }),
    on(usersActions.filterUsersFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.clearLoadedUsers, (state)=>{
        return usersAdapter.removeAll(state);
    }),
    on(usersActions.changeUserRoleSuccess, (state, action) => {
        return {
            ...state,
            chosenUserProfile: {
                ...state.chosenUserProfile!,
                role: action.newRole
            }
        }
    }),
    on(usersActions.deleteUserAccount, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.deleteUserAccountSuccess, (state, action)=>{
        return usersAdapter.removeOne(action.userId, {
            ...state,
            chosenUserProfile: null,
            isLoading: false
        });
    }),
    on(usersActions.deleteUserAccountFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    })
)