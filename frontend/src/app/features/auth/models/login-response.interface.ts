import { User } from "../../users/models/user.interface";

export interface LoginResponse {
    user: User;
    token: string;
}