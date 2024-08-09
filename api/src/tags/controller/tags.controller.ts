import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards, Request } from '@nestjs/common';
import { TagsService } from '../service/tags.service';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Observable } from 'rxjs';
import { TagDto } from '../dto/tag.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TagResponse } from '../dto/tag-response.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto): Observable<TagResponse> {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  filterByName(@Query('name') name: string = ''): Observable<TagResponse[]> {
    return this.tagsService.filterByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<TagResponse> {
    return this.tagsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto): Observable<TagResponse> {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Observable<any> {
    return this.tagsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-tag-to-user/:tagId')
  addTagToUser(@Param('tagId') tagId: number, @Request() req): Observable<TagResponse> {
      const userId = req.user.id;
      return this.tagsService.addTagToUser(userId, tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-tag-from-user/:tagId')
  removeTagFromUser(@Param('tagId') tagId: number, @Request() req): Observable<TagResponse> {
      const userId = req.user.id;
      return this.tagsService.removeTagFromUser(userId, tagId);
  }
}
