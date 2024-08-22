import { Room } from "../room/room.interface";

export interface CreateMessageDto {
    text: string;
    room: Room;
}