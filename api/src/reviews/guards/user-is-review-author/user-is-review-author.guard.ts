import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ReviewDto } from 'src/reviews/dto/review.dto';
import { ReviewsService } from 'src/reviews/service/reviews.service';

@Injectable()
export class UserIsReviewAuthorGuard implements CanActivate {

  constructor(private reviewsService: ReviewsService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const reviewId: number = params.id;
    const userId: number = request.user.id;
    
      return this.reviewsService.findOneById(reviewId).pipe(
        map((review: ReviewDto) => {
          const hasPermission = review.author.id === userId;
          return hasPermission;
      })
    )
  }

}
