import { UserRoles } from "../enums/user-roles.enum";

export class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    username?: string;
    profileImage?: string;
    role?: UserRoles;
}