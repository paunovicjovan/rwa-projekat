import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable, switchMap } from 'rxjs';
import { ReviewDto } from 'src/reviews/dto/review.dto';
import { ReviewsService } from 'src/reviews/service/reviews.service';
import { UserDto } from 'src/users/dto/user/user.dto';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { UsersService } from 'src/users/service/users/users.service';

@Injectable()
export class ReviewAuthorOrAdminGuard implements CanActivate {
  
  constructor(private reviewsService: ReviewsService,
              private usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const reviewId: number = params.id;
    const userId: number = request.user.id;
    
    const user = await this.usersService.findOneById(userId);
    const review = await this.reviewsService.findOneById(reviewId);
    
    const isBasicUser = user.role === UserRoles.USER;
    const isAuthor = user.id === review.author.id;
    const hasPermission = !isBasicUser || isAuthor;

    return hasPermission;
  }

}
