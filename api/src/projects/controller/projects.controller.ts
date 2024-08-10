import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { ProjectsService } from '../service/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileConfigurationByPath } from 'src/helpers/file-upload.helper';
import { Observable } from 'rxjs';
import { ProjectDto } from '../dto/project.dto';
import { ProjectFormData } from '../dto/project-form-data.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', getFileConfigurationByPath('uploads/project-images')))
  @Post()
  create(@UploadedFile() file, @Body() projectData: ProjectFormData, @Request() req): Observable<ProjectDto> {
    const createProjectDto: CreateProjectDto = JSON.parse(projectData.projectDtoStringified);
    return this.projectsService.create(file?.filename, createProjectDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
