import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReviewDisplayComponent } from './components/review-display/review-display.component';
import { ReviewsListComponent } from './components/reviews-list/reviews-list.component';
import { RatingModule } from 'primeng/rating';


@NgModule({
  declarations: [
    ReviewDisplayComponent,
    ReviewsListComponent,
  ],
  imports: [
    SharedModule,
    RatingModule
  ],
  exports: [
    ReviewsListComponent
  ]
})
export class ReviewsModule { }
