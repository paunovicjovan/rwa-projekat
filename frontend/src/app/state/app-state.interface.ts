import { AuthState } from "../features/auth/models/auth-state.interface";

export interface AppState {
    authState: AuthState;
}