import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ReviewsState } from "../models/reviews-state.interface";
import { Features } from "../../features.enum";
import { Review } from "../models/review.interface";


export const reviewsFeature = createFeatureSelector<ReviewsState>(Features.Reviews);

export const selectIsLoading = createSelector(
    reviewsFeature,
    (state: ReviewsState) => state.isLoading
)

export const selectReviewsOfUser = createSelector(
    reviewsFeature,
    (state: ReviewsState) => state.ids.map(id => state.entities[id])
                                      .filter(review => review != undefined)
                                      .map(review => review as Review)
)

export const selectPaginationMetadata = createSelector(
    reviewsFeature,
    (state: ReviewsState) => state.paginationMetadata
)