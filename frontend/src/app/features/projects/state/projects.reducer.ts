import { createReducer, on } from "@ngrx/store";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";
import { ProjectsState } from "../models/projects-state.interface";
import * as projectsActions from './projects.actions';
import { Project } from "../models/project.interface";
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";

const initialPaginationMetadataState : PaginationMetadata = {
    totalItems: 0,
    itemCount: 10,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1    
}

const initialState: ProjectsState = {
    ids: [],
    entities: {},
    isLoading: false,
    paginationMetadata: initialPaginationMetadataState
}

export const projectsAdapter: EntityAdapter<Project> = createEntityAdapter<Project>();

export const projectsReducer = createReducer(
    initialState,
    on(projectsActions.loadSuggestedProjects, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(projectsActions.loadSuggestedProjectsSuccess, (state, action) => {
        return projectsAdapter.setAll(action.projects, {
            ...state,
            isLoading: false
        })
    }),
    on(projectsActions.loadSuggestedProjectsFailure, (state) => {
        return projectsAdapter.removeAll({
            ...state,
            isLoading: false
        })
    }),
)