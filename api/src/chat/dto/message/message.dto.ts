import { UserDto } from "src/users/dto/user.dto";
import { RoomDto } from "../room/room.dto";

export class MessageDto {
    id: number;
    text: string;
    user: UserDto;
    room: RoomDto;
    createdAt: Date;
    updatedAt: Date;
}