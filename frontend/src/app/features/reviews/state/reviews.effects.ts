import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { catchError, concatMap, exhaustMap, from, map, Observable, of, switchMap } from "rxjs"
import { ReviewsService } from "../services/reviews.service";
import * as reviewsActions from './reviews.actions';
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Review } from "../models/review.interface";
import { MatDialog } from "@angular/material/dialog";
import { ReviewFormComponent } from "../components/review-form/review-form.component";
import { noOperation } from "../../../shared/state/shared.actions";
import { ReviewDialogData } from "../models/review-dialog-data.interface";
import { CreateReviewDto } from "../models/create-review-dto.interface";
import { UpdateReviewDto } from "../models/update-review-dto.interface";


export const loadReviewsOfUser$ = createEffect(
    (action$ = inject(Actions), reviewsService = inject(ReviewsService)) => {
        return action$.pipe(
            ofType(reviewsActions.loadReviewsOfUser),
            switchMap(({username, page, limit }) =>
                reviewsService.loadReviewsOfUser(username, page, limit).pipe(
                    map(( paginatedReviews: PaginatedResponse<Review>) => {
                        return reviewsActions.loadReviewsOfUserSuccess({ paginatedReviews })
                    }),
                    catchError(() => {
                        return of(reviewsActions.loadReviewsOfUserFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const openReviewDialog$ = createEffect(
    (action$ = inject(Actions), dialog = inject(MatDialog)) => {
        return action$.pipe(
            ofType(reviewsActions.openReviewDialog),
            exhaustMap(({ dialogData }) => {
                const dialogRef = dialog.open(ReviewFormComponent, { width: '600px', data: dialogData });
                return dialogRef.afterClosed().pipe(
                    concatMap((dialogResult: ReviewDialogData) => {
                        if (dialogResult === undefined) 
                            return of(noOperation());

                        if(dialogResult.id === undefined)
                        {
                            const createReviewDto : CreateReviewDto = {
                                content: dialogResult.content!,
                                rating: dialogResult.rating!,
                                revieweeUsername: dialogResult.revieweeUsername
                            }
                            return of(reviewsActions.createReview({ createReviewDto }))
                        }
                        else {
                            const updateReviewDto: UpdateReviewDto = {
                                id: dialogResult.id,
                                content: dialogResult.content!,
                                rating: dialogResult.rating!
                            }
                            return of(reviewsActions.updateReview({updateReviewDto}));
                        }
                      
                    })
                );
            }
            )
        )
    },
    {functional: true}
)

export const createReview$ = createEffect(
    (action$ = inject(Actions), reviewsService = inject(ReviewsService)) => {
        return action$.pipe(
            ofType(reviewsActions.createReview),
            concatMap(({ createReviewDto }) =>
                reviewsService.create(createReviewDto).pipe(
                    map(( review: Review ) => {
                        return reviewsActions.createReviewSuccess({ review })
                    }),
                    catchError(() => {
                        return of(reviewsActions.createReviewFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const updateReview$ = createEffect(
    (action$ = inject(Actions), reviewsService = inject(ReviewsService)) => {
        return action$.pipe(
            ofType(reviewsActions.updateReview),
            concatMap(({ updateReviewDto }) =>
                reviewsService.update(updateReviewDto).pipe(
                    map(( review: Review ) => {
                        return reviewsActions.updateReviewSuccess({ review })
                    }),
                    catchError(() => {
                        return of(reviewsActions.updateReviewFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const deleteReview$ = createEffect(
    (action$ = inject(Actions), reviewsService = inject(ReviewsService)) => {
        return action$.pipe(
            ofType(reviewsActions.deleteReview),
            concatMap(({ reviewId }) =>
                reviewsService.delete(reviewId).pipe(
                    map(() => {
                        return reviewsActions.deleteReviewSuccess({ deletedReviewId: reviewId })
                    }),
                    catchError(() => {
                        return of(reviewsActions.deleteReviewFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)