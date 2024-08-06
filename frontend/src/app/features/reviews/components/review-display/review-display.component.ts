import { Component, Input, OnInit } from '@angular/core';
import { Review } from '../../models/review.interface';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-review-display',
  templateUrl: './review-display.component.html',
  styleUrl: './review-display.component.scss'
})
export class ReviewDisplayComponent {

  @Input({required: true}) review!: Review;
  apiUrl: string = environment.apiUrl;
}
