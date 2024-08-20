import { User } from "../../users/models/user.interface";

export interface RoomDialogData {
    id: number | undefined;
    name: string | undefined;
    description: string | undefined;
    users: User[] | undefined;
}