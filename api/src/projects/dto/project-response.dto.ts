import { ProjectStatus } from "../enums/project-status.enum";
import { UserResponseDto } from "src/users/dto/user-response.dto";

export class ProjectResponseDto {
    id: number;
    title: string;
    image: string | null;
    description: string;
    requirements: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: ProjectStatus;
    applicationLink: string | null;
    repositoryLink: string | null;
    createdBy: UserResponseDto
}