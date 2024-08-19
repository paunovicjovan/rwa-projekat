import { UserDto } from "src/users/dto/user.dto";

export class ConnectedUserDto {
    id: number;
    socketId: string;
    user: UserDto;
}