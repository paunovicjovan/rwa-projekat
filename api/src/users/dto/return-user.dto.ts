import { UserRoles } from "../enums/user-roles.enum";

export interface ReturnUserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: UserRoles;
    profileImage: string | null;
    dateCreated: Date;
}