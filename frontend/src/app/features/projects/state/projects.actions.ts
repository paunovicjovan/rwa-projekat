import { createAction, props } from "@ngrx/store";
import { CreateProjectDto } from "../models/create-project-dto.interface";


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