import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '../entities/tag.entity';
import { Repository } from 'typeorm';
import { from, Observable, switchMap } from 'rxjs';
import { TagDto } from '../dto/tag.dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(TagEntity)
              private tagsRepository: Repository<TagEntity>) {}

  create(createTagDto: CreateTagDto): Observable<TagDto> {
    return from(this.tagsRepository.save(createTagDto));
  }

  findAll(): Observable<TagDto[]> {
    return from(this.tagsRepository.find());
  }

  findOne(id: number): Observable<TagDto> {
    return from(this.tagsRepository.findOne({where: {id}}));
  }

  update(id: number, updateTagDto: UpdateTagDto): Observable<TagDto> {
    return from(this.tagsRepository.update(id, updateTagDto)).pipe(
      switchMap(() => this.findOne(id))
    );
  }

  remove(id: number): Observable<any> {
    return from(this.tagsRepository.delete(id));
  }
}
