import { createReducer, on } from "@ngrx/store";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";
import { ProjectsState } from "../models/projects-state.interface";
import * as projectsActions from './projects.actions';
import * as usersActions from '../../users/state/users.actions';
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
    paginationMetadata: initialPaginationMetadataState,
    chosenProject: null,
    canUserApplyToProject: false
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
    on(projectsActions.filterProjects, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(projectsActions.filterProjectsSuccess, (state, action) => {
        return projectsAdapter.setAll(action.paginatedProjects.items, {
            ...state,
            isLoading: false, 
            paginationMetadata: action.paginatedProjects.meta
        })
    }),
    on(projectsActions.filterProjectsFailure, (state) => {
        return projectsAdapter.removeAll({
            ...state,
            isLoading: false,
            paginationMetadata: initialPaginationMetadataState
        })
    }),
    on(projectsActions.loadProject, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(projectsActions.loadProjectSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false, 
            chosenProject: { ...action.project, tags: [] },
            canUserApplyToProject: action.canUserApply
        }
    }),
    on(projectsActions.loadProjectFailure, (state) => {
        return {
            ...state,
            isLoading: false,
        }
    }),
    on(projectsActions.updateProject, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(projectsActions.updateProjectSuccess, (state, action) => {
        return projectsAdapter.updateOne({id: action.project.id, changes: action.project}, {
            ...state,
            isLoading: false,
            chosenProject: action.project
        })
    }),
    on(projectsActions.updateProjectFailure, (state) => {
        return projectsAdapter.removeAll({
            ...state,
            isLoading: false
        })
    }),
    on(projectsActions.findAppliedProjectsForUser, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(projectsActions.findAppliedProjectsForUserSuccess, (state, action) => {
        return projectsAdapter.setAll(action.paginatedProjects.items, {
            ...state,
            isLoading: false, 
            paginationMetadata: action.paginatedProjects.meta
        })
    }),
    on(projectsActions.findAppliedProjectsForUserFailure, (state) => {
        return projectsAdapter.removeAll({
            ...state,
            isLoading: false,
            paginationMetadata: initialPaginationMetadataState
        })
    }),
    on(projectsActions.findCreatedProjectsForUser, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(projectsActions.findCreatedProjectsForUserSuccess, (state, action) => {
        return projectsAdapter.setAll(action.paginatedProjects.items, {
            ...state,
            isLoading: false, 
            paginationMetadata: action.paginatedProjects.meta
        })
    }),
    on(projectsActions.findCreatedProjectsForUserFailure, (state) => {
        return projectsAdapter.removeAll({
            ...state,
            isLoading: false,
            paginationMetadata: initialPaginationMetadataState
        })
    }),
    on(projectsActions.findAcceptedProjectsForUser, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(projectsActions.findAcceptedProjectsForUserSuccess, (state, action) => {
        return projectsAdapter.setAll(action.paginatedProjects.items, {
            ...state,
            isLoading: false, 
            paginationMetadata: action.paginatedProjects.meta
        })
    }),
    on(projectsActions.findAcceptedProjectsForUserFailure, (state) => {
        return projectsAdapter.removeAll({
            ...state,
            isLoading: false,
            paginationMetadata: initialPaginationMetadataState
        })
    }),
    on(projectsActions.deleteProject, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(projectsActions.deleteProjectSuccess, (state, action)=>{
        return projectsAdapter.removeOne(action.projectId, {
            ...state,
            chosenProject: null,
            isLoading: false
        });
    }),
    on(projectsActions.deleteProjectFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    }),
    on(projectsActions.changeProjectImage, (state)=>{
        return {
            ...state,
            isLoading: true
        }
    }),
    on(projectsActions.changeProjectImageSuccess, (state, action)=>{
        return projectsAdapter.updateOne({id: action.project.id, changes: action.project } , {
            ...state,
            chosenProject: action.project,
            isLoading: false
        });
    }),
    on(projectsActions.changeProjectImageFailure, (state)=>{
        return {
            ...state,
            isLoading: false
        }
    }),
    on(usersActions.applyForProjectSuccess, (state) => {
        return {
            ...state,
            canUserApplyToProject: false
        }
    }),
    on(usersActions.unenrollUserFromProjectSuccess, (state) => {
        return {
            ...state,
            canUserApplyToProject: true
        }
    })
)