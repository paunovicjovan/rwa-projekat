import { Module } from '@nestjs/common';
import { ProjectsService } from './service/projects.service';
import { ProjectsController } from './controller/projects.controller';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
