import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { catchError, exhaustMap, map, of } from "rxjs"
import { ReviewsService } from "../services/reviews.service";
import * as reviewsActions from './reviews.actions';
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Review } from "../models/review.interface";


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
