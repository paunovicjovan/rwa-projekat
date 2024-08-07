import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { catchError, concatMap, exhaustMap, from, map, Observable, of } from "rxjs"
import { ReviewsService } from "../services/reviews.service";
import * as reviewsActions from './reviews.actions';
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Review } from "../models/review.interface";
import { MatDialog } from "@angular/material/dialog";
import { ReviewFormComponent } from "../components/review-form/review-form.component";
import { NoOperation } from "../../../shared/state/shared.actions";
import { ReviewDialogData } from "../models/review-dialog-data.interface";


export const loadReviewsOfUser$ = createEffect(
    (action$ = inject(Actions), reviewsService = inject(ReviewsService)) => {
        return action$.pipe(
            ofType(reviewsActions.loadReviewsOfUser),
            exhaustMap(({username, page, limit }) =>
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
                const dialogRef = dialog.open(ReviewFormComponent, { data: dialogData });
                return dialogRef.afterClosed().pipe(
                    concatMap((dialogResult: ReviewDialogData) => {
                        if (dialogResult !== undefined) {
                            if(dialogResult.id === undefined) {
                                return of(reviewsActions.createReview({reviewDto: {content: dialogResult.content!, rating: dialogResult.rating!}, revieweeUsername: dialogResult.revieweeUsername}))
                            }
                            else 
                                return of(NoOperation());
                        }
                        else {
                            return of(NoOperation())
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
            exhaustMap(({ reviewDto, revieweeUsername }) =>
                reviewsService.create(reviewDto, revieweeUsername).pipe(
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