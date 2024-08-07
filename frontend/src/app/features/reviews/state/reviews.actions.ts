import { createAction, props } from "@ngrx/store";
import { Review } from "../models/review.interface";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { ReviewDialogData } from "../models/review-dialog-data.interface";
import { CreateReviewDto } from "../models/create-review-dto.interface";
import { UpdateReviewDto } from "../models/update-review-dto.interface";

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

export const openReviewDialog = createAction(
    '[Reviews] Open Review Dialog',
    props<{ dialogData: ReviewDialogData | undefined }>()
);

export const createReview = createAction(
    '[Reviews] Create Review',
    props<{ reviewDto : CreateReviewDto }>()
);

export const createReviewSuccess = createAction(
    '[Reviews] Create Review Success',
    props<{ review : Review }>()
);

export const createReviewFailure = createAction(
    '[Reviews] Create Review Failure'
);

export const updateReview = createAction(
    '[Reviews] Update Review',
    props<{ reviewDto: UpdateReviewDto }>()
);

export const updateReviewSuccess = createAction(
    '[Reviews] Update Review Success',
    props<{ review : Review }>()
);

export const updateReviewFailure = createAction(
    '[Reviews] Update Review Failure'
)