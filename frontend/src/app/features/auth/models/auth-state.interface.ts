import { User } from "../../users/models/user.interface";

export interface AuthState {
    isSubmitting: boolean;
    currentLoggedInUser: User | undefined | null;
    token: string | null;
    errorMessage: string | null;
}