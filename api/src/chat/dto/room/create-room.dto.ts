import { UserDto } from "src/users/dto/user.dto";

export class CreateRoomDto {
    name: string;
    description: string | null;
    users: UserDto[];
    createdBy: UserDto;
}