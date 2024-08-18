import { ProjectStatus } from "../enums/project-status.enum";

export class UpdateProjectDto {
    title?: string;
    description?: string;
    requirements?: string;
    image?: string;
    status?: ProjectStatus;
    applicationLink?: string;
    repositoryLink?: string;
}
