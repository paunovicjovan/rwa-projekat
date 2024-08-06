import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReviewDisplayComponent } from './components/review-display/review-display.component';
import { ReviewsListComponent } from './components/reviews-list/reviews-list.component';
import { RatingModule } from 'primeng/rating';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features.enum';
import { EffectsModule } from '@ngrx/effects';
import * as reviewsEffects from './state/reviews.effects';
import { reviewsReducer } from './state/reviews.reducer';


@NgModule({
  declarations: [
    ReviewDisplayComponent,
    ReviewsListComponent,
  ],
  imports: [
    SharedModule,
    RatingModule,
    StoreModule.forFeature(Features.Reviews, reviewsReducer),
    EffectsModule.forFeature(reviewsEffects)
  ],
  exports: [
    ReviewsListComponent
  ]
})
export class ReviewsModule { }
