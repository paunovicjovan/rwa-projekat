import { UserDto } from "src/users/dto/user.dto";
import { RoomDto } from "./room.dto";

export class UpdateRoomMembershipDto {
    user: UserDto;
    roomId: number;
}