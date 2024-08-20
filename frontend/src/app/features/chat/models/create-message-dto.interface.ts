import { Room } from "./room.interface";

export interface CreateMessageDto {
    text: string;
    room: Room;
}