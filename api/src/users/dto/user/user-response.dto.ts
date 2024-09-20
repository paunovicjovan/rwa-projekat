import { UserRoles } from "../../enums/user-roles.enum";
import { TagResponseDto } from "src/tags/dto/tag-response.dto";

export class UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: UserRoles;
    profileImage: string | null;
    createdAt: Date;
    tags: TagResponseDto[]
}