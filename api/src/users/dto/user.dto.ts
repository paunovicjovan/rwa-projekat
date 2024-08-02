import { UserRoles } from "../enums/user-roles.enum";

export class UserDto {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: UserRoles;
    profileImage: string | null;
    dateCreated: Date;
}