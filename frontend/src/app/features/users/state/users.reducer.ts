import { createReducer, on } from "@ngrx/store";
import { UsersState } from "../models/users-state.interface";
import * as usersActions from './users.actions'
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { User } from "../models/user.interface";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";
import * as chatsActions from '../../chat/state/chat.actions';

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
    autocompletedUsers: [],
    isLoading: false,
    chosenUserProfile: null,
    paginationMetadata: initialPaginationMetadataState,
    personalityScore: null
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

    on(usersActions.autocompleteUsersSuccess, (state, action)=>{
        return {
            ...state,
            autocompletedUsers: action.paginatedUsers.items
        }
    }),
    on(usersActions.autocompleteUsersFailure, (state)=>{
        return {
            ...state,
            autocompletedUsers: []
        }
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
            isLoading: true
        }
    }),
    on(usersActions.updateUserDataSuccess, (state, action)=>{
        return usersAdapter.updateOne({id: action.user.id, changes: action.user}, {
            ...state,
            chosenUserProfile: action.user,
            isLoading: false
        });
    }),
    on(usersActions.updateUserDataFailure, (state, action)=>{
        return {
            ...state,
            isLoading: false
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
    on(usersActions.unenrollUserFromProjectSuccess, (state, action)=>{
        return usersAdapter.removeOne(action.user.id, {
            ...state,
            paginationMetadata: {
                ...state.paginationMetadata,
                totalItems: state.paginationMetadata.totalItems - 1,
                itemCount: state.paginationMetadata.itemCount - 1,
                itemsPerPage: state.paginationMetadata.itemsPerPage - 1
            }
        });
    }),
    on(usersActions.acceptUserInProjectSuccess, (state, action)=>{
        return usersAdapter.removeOne(action.user.id, {
            ...state,
            paginationMetadata: {
                ...state.paginationMetadata,
                totalItems: state.paginationMetadata.totalItems - 1,
                itemCount: state.paginationMetadata.itemCount - 1,
                itemsPerPage: state.paginationMetadata.itemsPerPage - 1
            }
        });
    }),
    on(chatsActions.receiveRoomMembersSuccess, (state, action)=>{
        return usersAdapter.setAll(action.members, state);
    }),
    on(usersActions.loadPersonalityScore, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.loadPersonalityScoreSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            personalityScore: action.personalityScore
        }
    }),
    on(usersActions.loadPersonalityScoreFailure, (state) => {
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.savePersonalityScore, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.savePersonalityScoreSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            personalityScore: action.personalityScore
        }
    }),
    on(usersActions.savePersonalityScoreFailure, (state) => {
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.searchSuggestedUsers, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.searchSuggestedUsersSuccess, (state, action) => {
        return usersAdapter.setAll(action.users, {...state,
            isLoading: false,
            paginationMetadata: initialPaginationMetadataState
        }) 
    }),
    on(usersActions.searchSuggestedUsersFailure, (state) => {
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.searchUsersByTags, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.searchUsersByTagsSuccess, (state, action)=>{
        return usersAdapter.setAll(action.paginatedUsers.items, {
            ...state, 
            isLoading: false, 
            paginationMetadata: action.paginatedUsers.meta
        })
    }),
    on(usersActions.searchUsersByTagsFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.loadSuggestedCollaborators, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.loadSuggestedCollaboratorsSuccess, (state, action)=>{
        return usersAdapter.setAll(action.users, {
            ...state, 
            isLoading: false, 
            paginationMetadata: initialPaginationMetadataState
        })
    }),
    on(usersActions.loadSuggestedCollaboratorsFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.loadInvitedUsersForProject, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(usersActions.loadInvitedUsersForProjectSuccess, (state, action)=>{
        return usersAdapter.setAll(action.paginatedUsers.items, {
            ...state, 
            isLoading: false, 
            paginationMetadata: action.paginatedUsers.meta
        })
    }),
    on(usersActions.loadInvitedUsersForProjectFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    }),
)