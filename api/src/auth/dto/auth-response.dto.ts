import { UserResponseDto } from "../../users/dto/user/user-response.dto";

export class AuthResponseDto {
    user: UserResponseDto;
    token: string;
}