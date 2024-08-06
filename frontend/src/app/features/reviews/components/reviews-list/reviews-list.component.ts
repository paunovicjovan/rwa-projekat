import { Component, Input, OnInit } from '@angular/core';
import { Review } from '../../models/review.interface';
import { UserRoles } from '../../../users/models/user-roles.enum';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as reviewsActions from '../../state/reviews.actions'
import { combineLatest, Observable } from 'rxjs';
import * as reviewsSelectors from '../../state/reviews.selectors';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.scss'
})
export class ReviewsListComponent implements OnInit {

  @Input({required: true}) username!: string;
  dataFromStore$!: Observable<any>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(reviewsActions.loadReviewsOfUser({username: this.username, page: 1, limit: 3}));
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(reviewsSelectors.selectIsLoading),
      reviews: this.store.select(reviewsSelectors.selectReviewsOfUser),
      paginationMetadata: this.store.select(reviewsSelectors.selectPaginationMetadata)
    });
  }

  onPaginateChange(event: PageEvent) {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    this.store.dispatch(reviewsActions.loadReviewsOfUser({username: this.username, page, limit}));
  }
  
}
