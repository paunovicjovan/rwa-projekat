import { CreateUserDto } from "src/users/dto/user/create-user.dto";
import { CreateRoomDto } from "../room/create-room.dto";

export class CreateJoinedRoomDto {
    socketId: string;
    user: CreateUserDto;
    room: CreateRoomDto;
}