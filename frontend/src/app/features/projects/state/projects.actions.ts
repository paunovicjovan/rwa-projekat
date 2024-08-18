import { createAction, props } from "@ngrx/store";
import { CreateProjectDto } from "../models/create-project-dto.interface";
import { Project } from "../models/project.interface";
import { FilterProjectsRequest } from "../models/filter-projects-request.interface";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";
import { UpdateProjectDto } from "../models/update-project-dto.interface";
import { PaginationParameters } from "../../../shared/models/pagination-parameters.interface";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { ProjectStatus } from "../enums/project-status.enum";


export const createProject = createAction(
    '[Projects] Create Project',
    props<{ image?: File, createProjectDto: CreateProjectDto  }>()
);

export const createProjectSuccess = createAction(
    '[Projects] Create Project Success', //dodaj props?
);

export const createProjectFailure = createAction(
    '[Projects] Create Project Failure',
);

export const loadSuggestedProjects = createAction(
    '[Projects] Load Suggested Projects'
);

export const loadSuggestedProjectsSuccess = createAction(
    '[Projects] Load Suggested Projects Success',
    props<{ projects: Project[] }>()
);

export const loadSuggestedProjectsFailure = createAction(
    '[Projects] Load Suggested Projects Failure',
);


export const filterProjects = createAction(
    '[Projects] Filter Projects',
    props<{ filterProjectsRequest: FilterProjectsRequest }>()
);

export const filterProjectsSuccess = createAction(
    '[Projects] Filter Projects Success',
    props<{ projects: Project[], paginationMetadata: PaginationMetadata }>()
);

export const filterProjectsFailure = createAction(
    '[Projects] Filter Projects Failure',
);

export const loadProject = createAction(
    '[Projects] Load Project',
    props<{ projectId: number }>()
);

export const loadProjectSuccess = createAction(
    '[Projects] Load Project Success',
    props<{ project: Project }>()
);

export const loadProjectFailure = createAction(
    '[Projects] Load Project Failure'
);

export const updateProject = createAction(
    '[Projects] Update Project',
    props<{ updateProjectDto: UpdateProjectDto }>()
);

export const updateProjectSuccess = createAction(
    '[Projects] Update Project Success',
    props<{ project: Project }>()
);

export const updateProjectFailure = createAction(
    '[Projects] Update Project Failure'
);

export const openProjectDialog = createAction(
    '[Projects] Open Project Dialog',
    props<{ dialogData: UpdateProjectDto }>()
);

export const findCreatedProjectsForUser = createAction(
    '[Projects] Find Created Projects For User',
    props<{ username: string, status: ProjectStatus, paginationOptions: PaginationParameters }>()
);

export const findCreatedProjectsForUserSuccess = createAction(
    '[Projects] Find Created Projects For User Success',
    props<{ paginatedProjects: PaginatedResponse<Project> }>()
);

export const findCreatedProjectsForUserFailure = createAction(
    '[Projects] Find Created Projects For User Failure'
);

export const findAppliedProjectsForUser = createAction(
    '[Projects] Find Applied Projects For User',
    props<{ username: string, paginationOptions: PaginationParameters }>()
);

export const findAppliedProjectsForUserSuccess = createAction(
    '[Projects] Find Applied Projects For User Success',
    props<{ paginatedProjects: PaginatedResponse<Project> }>()
);

export const findAppliedProjectsForUserFailure = createAction(
    '[Projects] Find Applied Projects For User Failure'
);

export const findAcceptedProjectsForUser = createAction(
    '[Projects] Find Accepted Projects For User',
    props<{ username: string, isCompleted: boolean, paginationOptions: PaginationParameters }>()
);

export const findAcceptedProjectsForUserSuccess = createAction(
    '[Projects] Find Accepted Projects For User Success',
    props<{ paginatedProjects: PaginatedResponse<Project> }>()
);

export const findAcceptedProjectsForUserFailure = createAction(
    '[Projects] Find Accepted Projects For User Failure'
);

export const deleteProject = createAction(
    '[Projects] Delete Project',
    props<{ projectId: number }>()
);

export const deleteProjectSuccess = createAction(
    '[Projects] Delete Project Success',
    props<{ projectId: number }>()
);

export const deleteProjectFailure = createAction(
    '[Projects] Delete Project Failure'
);