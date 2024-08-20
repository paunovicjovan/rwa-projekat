import { UserResponseDto } from "src/users/dto/user-response.dto";

export class RoomResponseDto {
    id: number;
    name: string;
    description: string | null;
    users: UserResponseDto[]
    createdAt: Date;
    updatedAt: Date;
}