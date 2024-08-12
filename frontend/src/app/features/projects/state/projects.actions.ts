import { createAction, props } from "@ngrx/store";
import { CreateProjectDto } from "../models/create-project-dto.interface";
import { Project } from "../models/project.interface";


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
