import { ReturnUserDto } from "./return-user.dto";

export type AuthenticatedUserDto = ReturnUserDto & {
    token: string;
}