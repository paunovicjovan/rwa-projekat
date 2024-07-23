import { ReturnUserDto } from "../../users/dto/return-user.dto";

export interface AuthResponseDto {
    user: ReturnUserDto;
    token: string;
}