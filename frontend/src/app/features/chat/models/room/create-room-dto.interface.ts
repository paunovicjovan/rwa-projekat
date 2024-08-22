import { User } from "../../../users/models/user.interface";

export interface CreateRoomDto {
    name: string;
    description: string | null;
    users: User[]
}