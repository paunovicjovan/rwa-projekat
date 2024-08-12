import { AuthState } from "../features/auth/models/auth-state.interface";
import { ProjectsState } from "../features/projects/models/projects-state.interface";
import { ReviewsState } from "../features/reviews/models/reviews-state.interface";
import { TagsState } from "../features/tags/models/tags-state.interface";
import { UsersState } from "../features/users/models/users-state.interface";

export interface AppState {
    authState: AuthState;
    usersState: UsersState;
    reviewsState: ReviewsState;
    tagsState: TagsState;
    projectsState: ProjectsState;
}