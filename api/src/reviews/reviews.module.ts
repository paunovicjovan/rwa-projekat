import { forwardRef, Module } from '@nestjs/common';
import { ReviewsService } from './service/reviews.service';
import { ReviewsController } from './controller/reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]),
    forwardRef(() => UsersModule)
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService]
})
export class ReviewsModule {}
