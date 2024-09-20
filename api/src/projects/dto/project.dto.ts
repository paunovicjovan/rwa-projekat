import { TagDto } from "src/tags/dto/tag.dto";
import { ProjectStatus } from "../enums/project-status.enum";
import { UserDto } from "src/users/dto/user/user.dto";

export class ProjectDto {
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
    tags: TagDto[]
    createdBy: UserDto
    appliedBy: UserDto[]
    acceptedUsers: UserDto[]
}