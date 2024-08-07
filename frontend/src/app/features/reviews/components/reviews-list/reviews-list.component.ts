import { Component, Input, OnInit } from '@angular/core';
import { Review } from '../../models/review.interface';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as reviewsActions from '../../state/reviews.actions'
import { combineLatest, filter, Observable, tap } from 'rxjs';
import * as reviewsSelectors from '../../state/reviews.selectors';
import * as authSelectors from '../../../auth/state/auth.selectors';
import { PageEvent } from '@angular/material/paginator';
import { ReviewDialogData } from '../../models/review-dialog-data.interface';
import * as sharedActions from '../../../../shared/state/shared.actions';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.scss'
})
export class ReviewsListComponent implements OnInit {

  @Input({required: true}) revieweeUsername!: string;
  dataFromStore$!: Observable<any>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(reviewsActions.loadReviewsOfUser({username: this.revieweeUsername, page: 1, limit: 3}));
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(reviewsSelectors.selectIsLoading),
      reviews: this.store.select(reviewsSelectors.selectReviewsOfUser),
      paginationMetadata: this.store.select(reviewsSelectors.selectPaginationMetadata),
      loggedInUser: this.store.select(authSelectors.selectCurrentLoggedInUser)
    });
  }

  onPaginateChange(event: PageEvent) {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    this.store.dispatch(reviewsActions.loadReviewsOfUser({username: this.revieweeUsername, page, limit}));
  }
  
  showNewReviewForm() {
    const dialogData: ReviewDialogData = {
      id: undefined, 
      rating: undefined,
      content: undefined,
      revieweeUsername: this.revieweeUsername
    }
    this.store.dispatch(reviewsActions.openReviewDialog({dialogData}))
  }

  showUpdateReviewForm(review: Review) {
    const dialogData: ReviewDialogData = {
      id: review.id,
      rating: review.rating,
      content: review.content,
      revieweeUsername: review.reviewee.username
    }
    this.store.dispatch(reviewsActions.openReviewDialog({dialogData}));
  }

  deleteReview(reviewId: number) {
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: "Da li sigurno želite da obrišete izabranu ocenu?",
      actionToDispatch: reviewsActions.deleteReview({reviewId})
    }))    
  }
}
