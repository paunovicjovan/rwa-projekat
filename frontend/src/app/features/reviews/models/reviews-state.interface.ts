import { EntityState } from "@ngrx/entity";
import { Review } from "./review.interface";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";

export interface ReviewsState extends EntityState<Review> {
    paginationMetadata: PaginationMetadata;
    isLoading: boolean;
}