import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { TagsService } from '../service/tags.service';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
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
    try {
      return await this.tagsService.create(createTagDto);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom kreiranja taga.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async filterByName(@Query('name') name: string = ''): Promise<TagResponseDto[]> {
    try {
      return await this.tagsService.filterByName(name);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom pretrage tagova.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TagResponseDto> {
    try {
      return await this.tagsService.findOne(+id);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom pretrage tagova.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(UserRoles.MODERATOR, UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto): Promise<TagResponseDto> {
    try {
      return await this.tagsService.update(+id, updateTagDto);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom ažuriranja podataka o tagu.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(UserRoles.MODERATOR, UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    try {
      return await this.tagsService.deleteOne(+id);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom brisanja taga.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-tag-to-user/:tagId')
  async addTagToUser(@Param('tagId') tagId: number, @Request() req): Promise<TagResponseDto> {
    try {
      const userId = req.user.id;
      return await this.tagsService.addTagToUser(+userId, +tagId);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom dodavanja taga korisniku.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-tag-from-user/:tagId')
  async removeTagFromUser(@Param('tagId') tagId: number, @Request() req): Promise<TagResponseDto> {
    try {
      const userId = req.user.id;
      return await this.tagsService.removeTagFromUser(+userId, +tagId);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom uklanjanja taga od korisnika.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-tag-to-project/:tagId/:projectId')
  async addTagToProject(@Param('tagId') tagId: number, @Param('projectId') projectId: number): Promise<TagResponseDto> {
    try {
      return await this.tagsService.addTagToProject(+projectId, +tagId);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom dodavanja taga projektu.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-tag-from-project/:tagId/:projectId')
  async removeTagFromProject(@Param('tagId') tagId: number, @Param('projectId') projectId: number): Promise<TagResponseDto> {
    try {
      return await this.tagsService.removeTagFromProject(+projectId, +tagId);
    }
    catch(err) {
      throw new HttpException('Došlo je do greške prilikom uklanjanja taga sa projekta.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
