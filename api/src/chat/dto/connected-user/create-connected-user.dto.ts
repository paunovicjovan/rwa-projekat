import { UserDto } from "src/users/dto/user.dto";

export class CreateConnectedUserDto {
    socketId: string;
    user: UserDto;
}