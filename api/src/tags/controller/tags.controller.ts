import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards, Request } from '@nestjs/common';
import { TagsService } from '../service/tags.service';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Observable } from 'rxjs';
import { TagDto } from '../dto/tag.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TagResponseDto } from '../dto/tag-response.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/users/enums/user-roles.enum';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Roles(UserRoles.MODERATOR, UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createTagDto: CreateTagDto): Promise<TagResponseDto> {
    return await this.tagsService.create(createTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async filterByName(@Query('name') name: string = ''): Promise<TagResponseDto[]> {
    return await this.tagsService.filterByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TagResponseDto> {
    return await this.tagsService.findOne(+id);
  }

  @Roles(UserRoles.MODERATOR, UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto): Promise<TagResponseDto> {
    return await this.tagsService.update(+id, updateTagDto);
  }

  @Roles(UserRoles.MODERATOR, UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return await this.tagsService.deleteOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-tag-to-user/:tagId')
  async addTagToUser(@Param('tagId') tagId: number, @Request() req): Promise<TagResponseDto> {
      const userId = req.user.id;
      return await this.tagsService.addTagToUser(+userId, +tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-tag-from-user/:tagId')
  async removeTagFromUser(@Param('tagId') tagId: number, @Request() req): Promise<TagResponseDto> {
      const userId = req.user.id;
      return await this.tagsService.removeTagFromUser(+userId, +tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-tag-to-project/:tagId/:projectId')
  async addTagToProject(@Param('tagId') tagId: number, @Param('projectId') projectId: number): Promise<TagResponseDto> {
      return await this.tagsService.addTagToProject(+projectId, +tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-tag-from-project/:tagId/:projectId')
  async removeTagFromProject(@Param('tagId') tagId: number, @Param('projectId') projectId: number): Promise<TagResponseDto> {
      return await this.tagsService.removeTagFromProject(+projectId, +tagId);
  }
}
