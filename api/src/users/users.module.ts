import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => ReviewsModule),
    forwardRef(() => ChatModule)
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
