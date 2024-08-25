import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '../entities/tag.entity';
import { Raw, Repository } from 'typeorm';
import { UsersService } from 'src/users/service/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { TagResponseDto } from '../dto/tag-response.dto';
import { ProjectsService } from 'src/projects/service/projects.service';
import { ProjectDto } from 'src/projects/dto/project.dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(TagEntity)
              private tagsRepository: Repository<TagEntity>,
              private usersService: UsersService,
              private projectsService: ProjectsService
              ) {}

  async create(createTagDto: CreateTagDto): Promise<TagResponseDto> {
    return this.tagsRepository.save(createTagDto);
  }

  async filterByName(name: string): Promise<TagResponseDto[]> {
    if(name === '')
        return [];
      
    return this.tagsRepository.find({
      where: {
        name: Raw(tagInDb => `LOWER(${tagInDb}) LIKE '%${name.toLowerCase()}%'`)
      },
      take: 6
    });
  }

  async findOne(id: number): Promise<TagResponseDto> {
    return this.tagsRepository.findOne({where: {id}});
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<TagResponseDto> {
    await this.tagsRepository.update(id, updateTagDto);
    return await this.findOne(id);
  }

  async deleteOne(id: number): Promise<any> {
    const tag = await this.tagsRepository.findOne({
      where: {id},
      relations: ['projects', 'users']
    });
    tag.projects = [];
    tag.users = [];
    await this.tagsRepository.save(tag);
    return await this.tagsRepository.delete(id);
  }

  async addTagToUser(userId: number, tagId: number): Promise<TagResponseDto> {
    const user = await this.usersService.findOneById(userId);
    const tag = await this.tagsRepository.findOne({
      where: {id: tagId}, 
      relations: ['users']
    });
    tag.users.push(user);
    return await this.tagsRepository.save(tag);
  } 

  async removeTagFromUser(userId: number, tagId: number): Promise<TagResponseDto> {
    const tag = await this.tagsRepository.findOne({
      where: {id: tagId}, 
      relations: ['users']
    });
    tag.users = tag.users.filter((user: UserDto) => user.id !== userId);
    return await this.tagsRepository.save(tag);
  }

  async addTagToProject(projectId: number, tagId: number): Promise<TagResponseDto> {
    const project = await this.projectsService.findOne(projectId);
    const tag = await this.tagsRepository.findOne({
      where: {id: tagId}, 
      relations: ['projects']
    });
    tag.projects.push(project);
    return await this.tagsRepository.save(tag);
  } 

  async removeTagFromProject(projectId: number, tagId: number): Promise<TagResponseDto> {
    const tag = await this.tagsRepository.findOne({
      where: {id: tagId}, 
      relations: ['projects']
    });
    tag.projects = tag.projects.filter((project: ProjectDto) => project.id !== projectId);
    return await this.tagsRepository.save(tag);
  } 
}
