import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from '../service/reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { Observable } from 'rxjs';
import { ReviewDto } from '../dto/review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReviewAuthorOrAdminGuard } from '../guards/review-author-or-admin/review-author-or-admin.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':revieweeId')
  create(@Param('revieweeId') revieweeId: number, @Body() review: CreateReviewDto, @Request() req) : Observable<ReviewDto> {
    const authorId = req.user.id;
    return this.reviewsService.create(review, +authorId, +revieweeId);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard, ReviewAuthorOrAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reviewsService.deleteOne(+id);
  }
}
