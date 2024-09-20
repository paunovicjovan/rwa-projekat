import { UserDto } from "src/users/dto/user/user.dto";
import { RoomDto } from "../room/room.dto";

export class JoinedRoomDto {
  id: number;
  socketId: string;
  user: UserDto;
  room: RoomDto;
}