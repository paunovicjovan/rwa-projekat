import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, Query } from '@nestjs/common';
import { ProjectsService } from '../service/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileConfigurationByPath } from 'src/helpers/file-upload.helper';
import { Observable } from 'rxjs';
import { ProjectDto } from '../dto/project.dto';
import { CreateProjectFormData } from '../dto/create -project-form-data.dto';
import { ProjectResponseDto } from '../dto/project-response.dto';
import { SearchProjectsFilters } from '../dto/search-projects-filters.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', getFileConfigurationByPath('uploads/project-images')))
  @Post()
  create(@UploadedFile() file, @Body() projectData: CreateProjectFormData, @Request() req): Observable<ProjectDto> {
    const createProjectDto: CreateProjectDto = JSON.parse(projectData.projectDtoStringified);
    return this.projectsService.create(file?.filename, createProjectDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('suggested-projects')
  findSuggestedProjectsForUser(@Request() req): Observable<ProjectResponseDto[]> {
    const userId = req.user.id;
    return this.projectsService.findSuggestedProjectsForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findManyPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body() searchFilters: SearchProjectsFilters 
  ) {
    limit = Math.min(100, limit);
    return this.projectsService.findManyPaginated({ page, limit }, searchFilters);
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
