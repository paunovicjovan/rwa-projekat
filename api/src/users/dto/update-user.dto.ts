import { UserRoles } from "../enums/user-roles.enum";

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    username?: string;
    profileImage?: string;
    role?: UserRoles;
}