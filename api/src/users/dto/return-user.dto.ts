import { UserRoles } from "./user.dto";

export interface ReturnUserDto {
    id: number;
    email: string;
    username: string;
    role: UserRoles;
    profileImage?: string;
}