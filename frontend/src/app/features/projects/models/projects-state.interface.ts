import { EntityState } from "@ngrx/entity";
import { Project } from "./project.interface";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";
import { EnhanceProjectDto } from "./enhance-project-dto.interface";

export interface ProjectsState extends EntityState<Project> {
    isLoading: boolean;
    paginationMetadata: PaginationMetadata;
    chosenProject: Project | null;
    canUserApplyToProject: boolean;
    generatedImage: string | null;
    enhancedProjectData: EnhanceProjectDto | null
}