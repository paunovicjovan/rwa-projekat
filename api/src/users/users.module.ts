import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './service/users/users.service';
import { UsersController } from './controller/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { ChatModule } from 'src/chat/chat.module';
import { PersonalityScoreEntity } from './entities/personality-score.entity';
import { PersonalityScoreService } from './service/personality-score/personality-score.service';
import { PersonalityScoreController } from './controller/personality-score/personality-score.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PersonalityScoreEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => ReviewsModule),
    forwardRef(() => ChatModule)
  ],
  providers: [UsersService, PersonalityScoreService],
  controllers: [UsersController, PersonalityScoreController],
  exports: [UsersService]
})
export class UsersModule {}
