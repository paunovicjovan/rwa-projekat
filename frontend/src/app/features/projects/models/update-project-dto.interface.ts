import { ProjectStatus } from "../enums/project-status.enum";

export interface UpdateProjectDto {
    id: number;
    title?: string;
    description?: string;
    requirements?: string | null;
    status?: ProjectStatus;
    applicationLink?: string | null;
    repositoryLink?: string | null;
}