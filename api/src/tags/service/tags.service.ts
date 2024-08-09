import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '../entities/tag.entity';
import { Like, Raw, Repository } from 'typeorm';
import { filter, forkJoin, from, NotFoundError, Observable, of, switchMap } from 'rxjs';
import { TagDto } from '../dto/tag.dto';
import { UsersService } from 'src/users/service/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { TagResponse } from '../dto/tag-response.dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(TagEntity)
              private tagsRepository: Repository<TagEntity>,
              private usersService: UsersService
              ) {}

  create(createTagDto: CreateTagDto): Observable<TagResponse> {
    return from(this.tagsRepository.save(createTagDto));
  }

  filterByName(name: string): Observable<TagResponse[]> {
    if(name === '')
        return of([]);
      
    return from(this.tagsRepository.find({
      where: {
        name: Raw(tagInDb => `LOWER(${tagInDb}) LIKE '%${name.toLowerCase()}%'`)
      },
      take: 6
    }));
  }

  findOne(id: number): Observable<TagResponse> {
    return from(this.tagsRepository.findOne({where: {id}}));
  }

  update(id: number, updateTagDto: UpdateTagDto): Observable<TagResponse> {
    return from(this.tagsRepository.update(id, updateTagDto)).pipe(
      switchMap(() => this.findOne(id))
    );
  }

  remove(id: number): Observable<any> {
    return from(this.tagsRepository.delete(id));
  }

  addTagToUser(userId: number, tagId: number): Observable<TagResponse> {
    return forkJoin([
      this.usersService.findOneById(userId),
      this.tagsRepository.findOne({
        where: {id: tagId}, 
        relations: ['users']
      })
    ]).pipe(
      switchMap(([user, tag]) => {
        tag.users.push(user);
        return from(this.tagsRepository.save(tag));
      })
    )
  } 

  removeTagFromUser(userId: number, tagId: number): Observable<TagResponse> {
    return from(this.tagsRepository.findOne({
      where: {id: tagId}, 
      relations: ['users']
    })).pipe(
      switchMap((tag: TagDto) => {
        tag.users = tag.users.filter((user: UserDto) => user.id !== userId)
        return from(this.tagsRepository.save(tag));
      })
    )
  } 
}
