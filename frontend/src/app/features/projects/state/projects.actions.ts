import { createAction, props } from "@ngrx/store";
import { CreateProjectDto } from "../models/create-project-dto.interface";
import { Project } from "../models/project.interface";
import { FilterProjectsRequest } from "../models/filter-projects-request.interface";
import { UpdateProjectDto } from "../models/update-project-dto.interface";
import { PaginationOptions } from "../../../shared/models/pagination-options.interface";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { ProjectStatus } from "../enums/project-status.enum";
import { EnhanceProjectDto } from "../models/enhance-project-dto.interface";


export const createProject = createAction(
    '[Projects] Create Project',
    props<{ image?: File, createProjectDto: CreateProjectDto  }>()
);

export const createProjectSuccess = createAction(
    '[Projects] Create Project Success',
    props<{ createdProject: Project }>()
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
    props<{ paginatedProjects: PaginatedResponse<Project> }>()
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
    props<{ project: Project, canUserApply: boolean }>()
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
    props<{ username: string, status: ProjectStatus, paginationOptions: PaginationOptions }>()
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
    props<{ username: string, paginationOptions: PaginationOptions }>()
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
    props<{ username: string, isCompleted: boolean, paginationOptions: PaginationOptions }>()
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

export const changeProjectImage = createAction(
    '[Projects] Change Project Image',
    props<{ projectId: number; image: File }>()
);

export const changeProjectImageSuccess = createAction(
    '[Projects] Change Project Image Success',
    props<{ project: Project }>()
);

export const changeProjectImageFailure = createAction(
    '[Projects] Change Project Image Failure'
);

export const generateImage = createAction(
    '[Projects] Generate Image',
    props<{ imageDescription: string }>()
);

export const generateImageSuccess = createAction(
    '[Projects] Generate Image Success',
    props<{ base64Image: string }>()
);

export const generateImageFailure = createAction(
    '[Projects] Generate Image Failure'
);

export const enhanceProjectData = createAction(
    '[Projects] Enhance Project Data',
    props<{ oldProjectData: EnhanceProjectDto }>()
);

export const enhanceProjectDataSuccess = createAction(
    '[Projects] Enhance Project Data Success',
    props<{ newProjectData: EnhanceProjectDto }>()
);

export const enhanceProjectDataFailure = createAction(
    '[Projects] Enhance Project Data Failure'
);

export const clearEnhancedProjectData = createAction(
    '[Projects] Clear Enhanced Project Data'
);

export const loadReceivedInvitations = createAction(
    '[Projects] Load Received Invitations',
    props<{ options: PaginationOptions }>()
);

export const loadReceivedInvitationsSuccess = createAction(
    '[Projects] Load Received Invitations Success',
    props<{ paginatedProjects: PaginatedResponse<Project> }>()
);

export const loadReceivedInvitationsFailure = createAction(
    '[Projects] Load Received Invitations Failure'
);
