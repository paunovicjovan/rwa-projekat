import { Module } from '@nestjs/common';
import { ProjectsService } from './service/projects.service';
import { ProjectsController } from './controller/projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProjectsController],
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),
    UsersModule
  ],
  providers: [ProjectsService],
})
export class ProjectsModule {}
