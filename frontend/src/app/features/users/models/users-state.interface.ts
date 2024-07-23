import { User } from "./user.interface";

export interface UsersState {
    isLoading: boolean;
    chosenUserProfile: User | null;
}