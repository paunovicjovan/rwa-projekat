import { UserRoles } from "./user-roles.enum";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: UserRoles;
    profileImage: string | null;
}