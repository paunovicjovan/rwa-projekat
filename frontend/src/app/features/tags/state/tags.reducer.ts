import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { TagsState } from "../models/tags-state.interface";
import { Tag } from "../models/tag.interface";
import { createReducer, on } from "@ngrx/store";
import * as tagsActions from './tags.actions';


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
    })
)