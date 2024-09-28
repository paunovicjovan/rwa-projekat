import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";
import { PersonalityScore } from "./personality-score.interface";
import { User } from "./user.interface";
import { EntityState } from '@ngrx/entity'

export interface UsersState extends EntityState<User> {
    autocompletedUsers: User[];
    isLoading: boolean;
    chosenUserProfile: User | null;
    paginationMetadata: PaginationMetadata;
    currentUserPersonalityScore: PersonalityScore | null;
    invitationsCount: number | null;
}