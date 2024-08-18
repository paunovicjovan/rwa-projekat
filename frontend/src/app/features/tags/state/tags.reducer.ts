import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { TagsState } from "../models/tags-state.interface";
import { Tag } from "../models/tag.interface";
import { createReducer, on } from "@ngrx/store";
import * as tagsActions from './tags.actions';
import * as usersActions from '../../users/state/users.actions';
import * as projectsActions from '../../projects/state/projects.actions';


export const initialState: TagsState = {
    ids: [],
    entities: {},
    isLoading: false,
    filteredTags: [],
}

export const tagsAdapter: EntityAdapter<Tag> = createEntityAdapter<Tag>();

export const tagsReducer = createReducer(
    initialState,
    on(tagsActions.searchTags, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(tagsActions.searchTagsSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            filteredTags: action.tags
        }
    }),
    on(tagsActions.searchTagsFailure, (state) => {
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.loadUserProfileSuccess, (state, action) => {
        return tagsAdapter.setAll(action.loadedUser.tags, state);
    }),
    on(projectsActions.loadProjectSuccess, (state, action) => {
        return tagsAdapter.setAll(action.project.tags, state);
    }),
    on(tagsActions.addTagToUserSuccess, (state, action) => {
        return tagsAdapter.addOne(action.tag, state);
    }),
    on(tagsActions.removeTagFromUserSuccess, (state, action) => {
        return tagsAdapter.removeOne(action.tag.id, state);
    }),
    on(tagsActions.addTagToProjectSuccess, (state, action) => {
        return tagsAdapter.addOne(action.tag, state);
    }),
    on(tagsActions.removeTagFromProjectSuccess, (state, action) => {
        return tagsAdapter.removeOne(action.tag.id, state);
    }),
)