import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";
import { User } from "./user.interface";
import { EntityState } from '@ngrx/entity'

export interface UsersState extends EntityState<User> {
    isLoading: boolean;
    chosenUserProfile: User | null;
    paginationMetadata: PaginationMetadata
}