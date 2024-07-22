import { User } from "../../users/models/user.interface";

export interface AuthState {
    isLoading: boolean;
    currentUser: User | undefined | null;
    token: string | null;
    error: string | null;
}