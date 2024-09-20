import { UserResponseDto } from "src/users/dto/user/user-response.dto";
import { RoomResponseDto } from "../room/room-response.dto";

export class JoinedRoomResponseDto {
    id: number;
    socketId: string;
    user: UserResponseDto;
    room: RoomResponseDto;
}