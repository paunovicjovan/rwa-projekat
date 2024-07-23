import { AuthState } from "../features/auth/models/auth-state.interface";
import { UsersState } from "../features/users/models/users-state.interface";

export interface AppState {
    authState: AuthState;
    usersState: UsersState
}