import { UserResponseDto } from "src/users/dto/user/user-response.dto";
import { RoomResponseDto } from "../room/room-response.dto";

export class MessageResponseDto {
    id: number;
    text: string;
    user: UserResponseDto;
    room: RoomResponseDto;
    createdAt: Date;
    updatedAt: Date;
}