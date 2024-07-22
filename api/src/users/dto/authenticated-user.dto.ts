import { ReturnUserDto } from "./return-user.dto";

export interface AuthenticatedUserDto {
    user: ReturnUserDto;
    token: string;
}