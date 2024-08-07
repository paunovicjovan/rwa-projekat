import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";
import { ReviewsState } from "../models/reviews-state.interface";
import { Review } from "../models/review.interface";
import { createReducer, on } from "@ngrx/store";
import * as reviewsActions from './reviews.actions'


const initialPaginationMetadataState : PaginationMetadata = {
    totalItems: 0,
    itemCount: 10,
    itemsPerPage: 3,
    totalPages: 1,
    currentPage: 1    
}

export const initialState: ReviewsState = {
    ids: [],
    entities: {},
    isLoading: false,
    paginationMetadata: initialPaginationMetadataState
}

export const reviewsAdapter: EntityAdapter<Review> = createEntityAdapter<Review>();

export const reviewsReducer = createReducer(
    initialState,
    on(reviewsActions.loadReviewsOfUser, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(reviewsActions.loadReviewsOfUserSuccess, (state, action) => {
        return reviewsAdapter.setAll(action.paginatedReviews.items, {
            ...state, 
            isLoading: false, 
            paginationMetadata: {
                ...action.paginatedReviews.meta
            }
        })
    }),
    on(reviewsActions.loadReviewsOfUserFailure, (state) => {
        return {
            ...state,
            isLoading: false
        }
    }),
    on(reviewsActions.createReview, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(reviewsActions.createReviewSuccess, (state, action) => {
        reviewsAdapter.removeOne(Number(state.ids[state.ids.length-1]), state);

        return reviewsAdapter.addOne(action.review, {
            ...state, 
            isLoading: false,
            paginationMetadata: {
                ...state.paginationMetadata,
                totalItems: state.paginationMetadata.totalItems + 1,
                itemCount: state.paginationMetadata.itemCount + 1,
                itemsPerPage: state.paginationMetadata.itemsPerPage + 1
            }
        })
    }),
    on(reviewsActions.createReviewFailure, (state) => {
        return {
            ...state,
            isLoading: false
        }
    }),
    on(reviewsActions.updateReview, (state) => {
        return {
            ...state,
            isLoading: true
        }
    }),
    on(reviewsActions.updateReviewSuccess, (state, action) => {
        return reviewsAdapter.updateOne( {id: action.review.id, changes: action.review }, {
            ...state, 
            isLoading: false
        })
    }),
    on(reviewsActions.createReviewFailure, (state) => {
        return {
            ...state,
            isLoading: false
        }
    })
)