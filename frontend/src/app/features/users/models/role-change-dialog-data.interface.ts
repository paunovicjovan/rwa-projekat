import { UserRoles } from "./user-roles.enum";

export interface RoleChangeDialogData {
    userId: number;
    role: UserRoles;
}