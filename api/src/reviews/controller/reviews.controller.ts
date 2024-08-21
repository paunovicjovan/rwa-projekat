import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Put, Query } from '@nestjs/common';
import { ReviewsService } from '../service/reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { Observable } from 'rxjs';
import { ReviewDto } from '../dto/review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReviewAuthorOrAdminGuard } from '../guards/review-author-or-admin/review-author-or-admin.guard';
import { UserIsReviewAuthorGuard } from '../guards/user-is-review-author/user-is-review-author.guard';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ReviewResponseDto } from '../dto/review-response.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':revieweeUsername')
  create(@Param('revieweeUsername') revieweeUsername: string, @Body() review: CreateReviewDto, @Request() req) : Promise<ReviewResponseDto> {
    const authorId = req.user.id;
    return this.reviewsService.create(review, +authorId, revieweeUsername);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':revieweeUsername')
  findManyPaginated(
      @Param('revieweeUsername') revieweeUsername: string,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
  ) {
      limit = Math.min(100, limit);
      const paginateOptions : IPaginationOptions = {
          limit,
          page
      }
      return this.reviewsService.findManyPaginated(paginateOptions, revieweeUsername);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) : Promise<ReviewResponseDto> {
    return this.reviewsService.findOneById(+id);
  }

  @UseGuards(JwtAuthGuard, UserIsReviewAuthorGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() reviewData: UpdateReviewDto) : Promise<ReviewResponseDto> {
    return this.reviewsService.update(+id, reviewData);
  }

  @UseGuards(JwtAuthGuard, ReviewAuthorOrAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: number) : Promise<any> {
    return this.reviewsService.deleteOne(+id);
  }
}
