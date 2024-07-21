import { UserRoles } from "./user.dto";

export interface ReturnUserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: UserRoles;
    profileImage: string | null;
}