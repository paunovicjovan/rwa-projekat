import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProjectsState } from "../models/projects-state.interface";
import { Features } from "../../features.enum";


export const projectsFeature = createFeatureSelector<ProjectsState>(Features.Projects);

export const selectIsLoading = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.isLoading
)

export const selectProjects = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.ids.map(id => state.entities[id])
)

export const selectPaginationMetadata = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.paginationMetadata
)

export const selectChosenProject = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.chosenProject
)