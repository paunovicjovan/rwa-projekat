import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TagsService } from '../service/tags.service';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Observable } from 'rxjs';
import { TagDto } from '../dto/tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto): Observable<TagDto> {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll(): Observable<TagDto[]> {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<TagDto> {
    return this.tagsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto): Observable<TagDto> {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Observable<any> {
    return this.tagsService.remove(+id);
  }
}
