import { User } from "../../../users/models/user.interface";
import { Room } from "../room/room.interface";

export interface Message {
    id: number;
    text: string;
    user: User;
    room: Room;
    createdAt: Date;
    updatedAt: Date;
}