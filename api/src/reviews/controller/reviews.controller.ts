import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Put, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ReviewsService } from '../service/reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
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
  async create(@Param('revieweeUsername') revieweeUsername: string, @Body() review: CreateReviewDto, @Request() req) : Promise<ReviewResponseDto> {
    try {
      const authorId = req.user.id;
      return await this.reviewsService.create(review, +authorId, revieweeUsername);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom kreiranja nove ocene.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':revieweeUsername')
  async findManyPaginated(
      @Param('revieweeUsername') revieweeUsername: string,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
  ) {
    try {
      limit = Math.min(100, limit);
      const paginateOptions : IPaginationOptions = {
        limit,
        page
      }
      return await this.reviewsService.findManyPaginated(paginateOptions, revieweeUsername);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom učitavanja ocena korisnika.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<ReviewResponseDto> {
    try {
      return await this.reviewsService.findOneById(+id);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom učitavanja ocene korisnika.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard, UserIsReviewAuthorGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() reviewData: UpdateReviewDto) : Promise<ReviewResponseDto> {
    try {
      return await this.reviewsService.update(+id, reviewData);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom ažuriranja ocene.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard, ReviewAuthorOrAdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) : Promise<any> {
    try {
      return await this.reviewsService.deleteOne(+id);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom brisanja ocene.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
