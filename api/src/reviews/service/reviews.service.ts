import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
      private reviewsRepository: Repository<ReviewEntity>,
      private usersService: UsersService
    ) {}

  create(review: CreateReviewDto, authorId: number, revieweeId: number) : Observable<ReviewDto> {
    return forkJoin([
      this.usersService.findOneById(authorId),
      this.usersService.findOneById(revieweeId)
    ]).pipe(
      switchMap(([author, reviewee]) => {
        const reviewEntity = this.createReviewEntity(review, author, reviewee);
        return from(this.reviewsRepository.save(reviewEntity));
      })
    )
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

  findManyPaginated(options: IPaginationOptions, revieweeUsername: string) : Observable<Pagination<ReviewDto>> {
    return from(paginate<ReviewDto>(
        this.reviewsRepository, 
        options, 
        {
            where: { reviewee: { username: revieweeUsername } },
            order: { createdAt: 'DESC' },
            relations: ['author']
        }
    ))
}

  findOneById(id: number) : Observable<ReviewDto> {
    return from(this.reviewsRepository.findOne({where: {id}, relations: ['author']}));
  }

  update(id: number, reviewData: UpdateReviewDto) : Observable<ReviewDto> {
    return from(this.reviewsRepository.update(id, reviewData)).pipe(
      switchMap(() => this.findOneById(id))
    );
  }

  deleteOne(id: number) : Observable<any> {
    return from(this.reviewsRepository.delete(id));
  }
}
