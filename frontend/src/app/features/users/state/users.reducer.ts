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
    paginationMetadata: initialPaginationMetadataState,
    errorMessage: null
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
    on(usersActions.loadUserProfileSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            chosenUserProfile: { ...action.loadedUser, tags: [] }
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
        return usersAdapter.updateOne({id: action.user.id, changes: action.user } , {
            ...state,
            chosenUserProfile: action.user,
        });
    }),
    on(usersActions.updateUserData, (state)=>{
        return {
            ...state,
            isLoading: true,
            errorMessage: null
        }
    }),
    on(usersActions.updateUserDataSuccess, (state, action)=>{
        return usersAdapter.updateOne({id: action.user.id, changes: action.user}, {
            ...state,
            chosenUserProfile: action.user,
            errorMessage: null,
            isLoading: false
        });
    }),
    on(usersActions.updateUserDataFailure, (state, action)=>{
        return {
            ...state,
            isLoading: false,
            errorMessage: action.errorMessage
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
    }),
    on(usersActions.changeUserProfileImage, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.changeUserProfileImageSuccess, (state, action)=>{
        return usersAdapter.updateOne({id: action.user.id, changes: action.user } , {
            ...state,
            chosenUserProfile: action.user,
            isLoading: false
        });
    }),
    on(usersActions.changeUserProfileImageFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.loadAppliedUsersForProject, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.loadAppliedUsersForProjectSuccess, (state, action)=>{
        return usersAdapter.setAll(action.paginatedUsers.items , {
            ...state,
            isLoading: false,
            paginationMetadata: action.paginatedUsers.meta
        });
    }),
    on(usersActions.loadAppliedUsersForProjectFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.loadAcceptedUsersForProject, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.loadAcceptedUsersForProjectSuccess, (state, action)=>{
        return usersAdapter.setAll(action.paginatedUsers.items , {
            ...state,
            isLoading: false,
            paginationMetadata: action.paginatedUsers.meta
        });
    }),
    on(usersActions.loadAcceptedUsersForProjectFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    }),
)