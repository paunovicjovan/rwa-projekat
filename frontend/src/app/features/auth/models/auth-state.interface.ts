import { User } from "../../users/models/user.interface";

export interface AuthState {
    isSubmitting: boolean;
    currentUser: User | undefined | null;
    token: string | null;
    errorMessage: string | null;
}