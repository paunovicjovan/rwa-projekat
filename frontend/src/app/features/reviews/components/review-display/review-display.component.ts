import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Review } from '../../models/review.interface';

@Component({
  selector: 'app-review-display',
  templateUrl: './review-display.component.html',
  styleUrl: './review-display.component.scss'
})
export class ReviewDisplayComponent {

  @Input({required: true}) review!: Review;
  @Input() canUpdate: boolean = false;
  @Input() canDelete: boolean = false;
  @Output() updateReview: EventEmitter<Review> = new EventEmitter();
  @Output() deleteReview: EventEmitter<number> = new EventEmitter();

  handleReviewUpdate() {
    this.updateReview.emit(this.review);
  }

  handleReviewDelete() {
    this.deleteReview.emit(this.review.id);
  }
}
