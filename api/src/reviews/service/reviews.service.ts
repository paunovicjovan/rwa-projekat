import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { Repository } from 'typeorm';
import { ReviewEntity } from '../entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { forkJoin, from, Observable, switchMap } from 'rxjs';
import { ReviewDto } from '../dto/review.dto';
import { UsersService } from 'src/users/service/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ReviewResponseDto } from '../dto/review-response.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
      private reviewsRepository: Repository<ReviewEntity>,
      @Inject(forwardRef(() => UsersService))
      private usersService: UsersService
    ) {}

  async create(review: CreateReviewDto, authorId: number, revieweeUsername: string) : Promise<ReviewResponseDto> {
    const author = await this.usersService.findOneById(authorId);
    const reviewee = await this.usersService.findOneByUsername(revieweeUsername);
    const reviewEntity = this.createReviewEntity(review, author, reviewee);
    return await this.reviewsRepository.save(reviewEntity);
  }

  private createReviewEntity(review: CreateReviewDto, author: UserDto, reviewee: UserDto) : ReviewEntity {
    const reviewEntity: ReviewEntity = {
      rating: review.rating,
      content: review.content,
      createdAt: new Date(),
      author: author,
      reviewee: reviewee
    } as ReviewEntity;

    return reviewEntity;
  }

  async findManyPaginated(options: IPaginationOptions, revieweeUsername: string) : Promise<Pagination<ReviewResponseDto>> {
    return await paginate<ReviewDto>(
        this.reviewsRepository, 
        options, 
        {
            where: { reviewee: { username: revieweeUsername } },
            order: { createdAt: 'DESC' },
            relations: ['author', 'reviewee']
        }
    );
}

  async findOneById(id: number) : Promise<ReviewResponseDto> {
    return await this.reviewsRepository.findOne({
      where: {id}, 
      relations: ['author', 'reviewee']
    });
  }

  async update(id: number, reviewData: UpdateReviewDto) : Promise<ReviewResponseDto> {
    await this.reviewsRepository.update(id, reviewData);
    return await this.findOneById(id);
  }

  async deleteOne(id: number) : Promise<any> {
    return await this.reviewsRepository.delete(id);
  }

  async deleteManyByAuthorId(userId: number): Promise<any> {
    return await this.reviewsRepository.delete({author: {id: userId}});
  }

  async deleteManyByRevieweeId(userId: number): Promise<any> {
    return await this.reviewsRepository.delete({reviewee: {id: userId}});
  }
}
