import { UserDto } from "src/users/dto/user/user.dto";
import { RoomDto } from "../room/room.dto";

export class CreateMessageDto {
    text: string;
    user: UserDto;
    room: RoomDto;
}