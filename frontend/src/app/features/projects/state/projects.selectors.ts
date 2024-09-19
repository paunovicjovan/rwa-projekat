import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProjectsState } from "../models/projects-state.interface";
import { Features } from "../../features.enum";
import { Project } from "../models/project.interface";


export const projectsFeature = createFeatureSelector<ProjectsState>(Features.Projects);

export const selectIsLoading = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.isLoading
)

export const selectProjects = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.ids.map(id => state.entities[id])
                                       .filter(project => project != undefined)
                                       .map(project => project as Project)
)

export const selectPaginationMetadata = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.paginationMetadata
)

export const selectChosenProject = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.chosenProject
)

export const selectCanUserApply = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.canUserApplyToProject
)

export const selectGeneratedImage = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.generatedImage
)

export const selectIsGeneratingImage = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.isGeneratingImage
)

export const selectEnhancedProjectData = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.enhancedProjectData
)

export const selectIsEnhancingProjectData = createSelector(
    projectsFeature,
    (state: ProjectsState) => state.isEnhancingProjectData
)