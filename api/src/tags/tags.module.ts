import { Module } from '@nestjs/common';
import { TagsService } from './service/tags.service';
import { TagsController } from './controller/tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { UsersModule } from 'src/users/users.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  controllers: [TagsController],
  imports: [
    TypeOrmModule.forFeature([TagEntity]),
    UsersModule,
    ProjectsModule
  ],
  providers: [TagsService],
})
export class TagsModule {}
