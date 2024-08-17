import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, Query, Res, Put } from '@nestjs/common';
import { ProjectsService } from '../service/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileConfigurationByPath } from 'src/helpers/file-upload.helper';
import { ProjectDto } from '../dto/project.dto';
import { CreateProjectFormData } from '../dto/create-project-form-data.dto';
import { ProjectResponseDto } from '../dto/project-response.dto';
import { SearchProjectsFilters } from '../dto/search-projects-filters.dto';
import * as path from 'path';
import { ProjectStatus } from '../enums/project-status.enum';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', getFileConfigurationByPath('uploads/project-images')))
  @Post()
  create(@UploadedFile() file, @Body() projectData: CreateProjectFormData, @Request() req): Promise<ProjectDto> {
    const createProjectDto: CreateProjectDto = JSON.parse(projectData.projectDtoStringified);
    return this.projectsService.create(file?.filename, createProjectDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('suggested-projects')
  findSuggestedProjectsForUser(@Request() req): Promise<ProjectResponseDto[]> {
    const userId = req.user.id;
    return this.projectsService.findSuggestedProjectsForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('filter-projects')
  findManyPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body() searchFilters: SearchProjectsFilters 
  ) {
    limit = Math.min(100, limit);
    return this.projectsService.findManyPaginated({ page, limit }, searchFilters);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto): Promise<ProjectResponseDto> {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.projectsService.deleteOne(+id);
  }

  @Get('project-image/:imageName')
  getProfileImage(@Param('imageName') imageName: string, @Res() res) : Promise<Object> {
      const relativeFilePath = `uploads/project-images/${imageName}`;
      const absoluteFilePath = path.join(process.cwd(), relativeFilePath); 
      return res.sendFile(absoluteFilePath);
  }

  @Get('applied-by/:username')
  findAppliedProjectsForUser(@Param('username') username: string,
                             @Query('page') page: number = 1, 
                             @Query('limit') limit: number = 10
  ) {
    return this.projectsService.findAppliedProjectsForUser(username, { page, limit });
  }

  @Get('accepted-user/:username/:isCompleted')
  findAcceptedProjectsForUser(@Param('username') username: string,
                              @Param('isCompleted') isCompleted: string,
                              @Query('page') page: number = 1, 
                              @Query('limit') limit: number = 10
  ) {
    return this.projectsService.findAcceptedProjectsForUser(username, isCompleted === 'true', { page, limit });
  }

  @Get('created-by/:username/:status')
  findCreatedProjectsForUser(@Param('username') username: string,
                              @Param('status') status: ProjectStatus,
                              @Query('page') page: number = 1, 
                              @Query('limit') limit: number = 10
  ) {
    return this.projectsService.findCreatedProjectsForUser(username, status, { page, limit });
  }
}
