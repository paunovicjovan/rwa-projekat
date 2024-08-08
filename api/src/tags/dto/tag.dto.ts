import { ProjectDto } from "src/projects/dto/project.dto";
import { UserDto } from "src/users/dto/user.dto";

export class TagDto {
    id: number;
    name: string;
    description: string | null;
    users: UserDto[]
    projects: ProjectDto[]
}