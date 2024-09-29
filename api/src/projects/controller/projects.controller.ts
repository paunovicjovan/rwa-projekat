import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, Query, Res, Put, HttpException, HttpStatus } from '@nestjs/common';
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
import { ProjectAuthorOrAdminGuard } from '../guards/project-author-or-admin/project-author-or-admin.guard';
import { UserIsProjectAuthorGuard } from '../guards/user-is-project-author/user-is-project-author.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', getFileConfigurationByPath('uploads/project-images')))
  @Post()
  async create(@UploadedFile() file, @Body() projectData: CreateProjectFormData, @Request() req): Promise<ProjectDto> {
    try {
      const createProjectDto: CreateProjectDto = JSON.parse(projectData.projectDtoStringified);
      return await this.projectsService.create(file?.filename, createProjectDto, +req.user.id);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom kreiranja projekta.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('suggested-projects')
  async findSuggestedProjectsForUser(@Request() req): Promise<ProjectResponseDto[]> {
    try {
      const userId = req.user.id;
      return await this.projectsService.findSuggestedProjectsForUser(+userId);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom traženja predloženih projekata.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('filter-projects')
  async findManyPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body() searchFilters: SearchProjectsFilters 
  ) {
    try {
      limit = Math.min(100, limit);
      return await this.projectsService.findManyPaginated({ page, limit }, searchFilters);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom pretrage projekata.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProjectResponseDto> {
    try {
      return await this.projectsService.findOne(+id);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom učitavanja podataka o projektu.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard, UserIsProjectAuthorGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto): Promise<ProjectResponseDto> {
    try {
      return await this.projectsService.update(+id, updateProjectDto);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom ažuriranja podataka o projektu.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard, ProjectAuthorOrAdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      return await this.projectsService.deleteOne(+id);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom brisanja projekta.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', getFileConfigurationByPath('uploads/project-images')))
  @Post('upload-project-image/:id')
  async uploadProjectImage(@UploadedFile() file, @Param('id') id: number) : Promise<ProjectResponseDto> {
    try {
      return await this.projectsService.updateProjectImage(+id, file.filename);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom ažuriranja slike projekta.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('project-image/:imageName')
  getProfileImage(@Param('imageName') imageName: string, @Res() res) : Promise<Object> {
    try {
      const relativeFilePath = `uploads/project-images/${imageName}`;
      const absoluteFilePath = path.join(process.cwd(), relativeFilePath); 
      return res.sendFile(absoluteFilePath);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom učitavanja slike projekta.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('applied-by/:username')
  async findAppliedProjectsForUser(@Param('username') username: string,
                             @Query('page') page: number = 1, 
                             @Query('limit') limit: number = 10
  ) {
    try {
      return await this.projectsService.findAppliedProjectsForUser(username, { page, limit });
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom učitavanja projekata.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('accepted-user/:username/:isCompleted')
  async findAcceptedProjectsForUser(@Param('username') username: string,
                              @Param('isCompleted') isCompleted: string,
                              @Query('page') page: number = 1, 
                              @Query('limit') limit: number = 10
  ) {
    try {
      return await this.projectsService.findAcceptedProjectsForUser(username, isCompleted === 'true', { page, limit });
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom učitavanja projekata.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('created-by/:username/:status')
  async findCreatedProjectsForUser(@Param('username') username: string,
                              @Param('status') status: ProjectStatus,
                              @Query('page') page: number = 1, 
                              @Query('limit') limit: number = 10
  ) {
    try {
      return await this.projectsService.findCreatedProjectsForUser(username, status, { page, limit });
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom učitavanja projekata.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('can-apply/:projectId')
  async canUserApply(@Param('projectId') projectId: number, @Request() req): Promise<boolean> {
    try {
      const userId = req.user.id;
      return await this.projectsService.canUserApply(+userId, projectId);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('find-received-invitations')
  async findProjectInvitationsForUser(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Request() req
  ) {
    try {
      return await this.projectsService.findProjectInvitationsForUser(+req.user.id, { page, limit });
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom učitavanja primljenih pozivnica.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
