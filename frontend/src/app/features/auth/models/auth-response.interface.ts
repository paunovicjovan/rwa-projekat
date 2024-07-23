import { User } from "../../users/models/user.interface";

export interface AuthResponse {
    user: User;
    token: string;
}