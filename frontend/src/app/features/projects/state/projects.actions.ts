import { createAction, props } from "@ngrx/store";
import { CreateProjectDto } from "../models/create-project-dto.interface";
import { Project } from "../models/project.interface";
import { FilterProjectsRequest } from "../models/filter-projects-request.interface";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";


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