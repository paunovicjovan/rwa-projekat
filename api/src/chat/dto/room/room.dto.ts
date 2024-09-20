import { UserDto } from "src/users/dto/user/user.dto";
import { JoinedRoomDto } from "../joined-room/joined-room.dto";
import { MessageDto } from "../message/message.dto";

export class RoomDto {
  id: number;
  name: string;
  description: string;
  users: UserDto[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserDto;
  joinedUsers: JoinedRoomDto[];
  messages: MessageDto[];
}