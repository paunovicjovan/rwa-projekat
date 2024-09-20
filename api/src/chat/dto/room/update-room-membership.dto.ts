import { UserDto } from "src/users/dto/user/user.dto";
import { RoomDto } from "./room.dto";

export class UpdateRoomMembershipDto {
    user: UserDto;
    roomId: number;
}