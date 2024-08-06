import { createAction, props } from "@ngrx/store";
import { Review } from "../models/review.interface";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";

export const loadReviewsOfUser = createAction(
    '[Reviews] Load Reviews Of User',
    props<{ username: string, page: number, limit: number }>() //mozda da se upakuje u dto
);

export const loadReviewsOfUserSuccess = createAction(
    '[Reviews] Load Reviews Of User Success',
    props<{ paginatedReviews: PaginatedResponse<Review> }>()
);


export const loadReviewsOfUserFailure = createAction(
    '[Reviews] Load Reviews Of User Failure'
);