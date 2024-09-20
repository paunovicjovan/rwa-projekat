import { UserDto } from "src/users/dto/user/user.dto";

export class CreateConnectedUserDto {
    socketId: string;
    user: UserDto;
}