import { ReturnUserDto } from "../../users/dto/return-user.dto";

export class AuthResponseDto {
    user: ReturnUserDto;
    token: string;
}