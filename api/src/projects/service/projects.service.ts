import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '../entities/project.entity';
import { Raw, Repository } from 'typeorm';
import { UsersService } from 'src/users/service/users.service';
import { defaultIfEmpty, filter, from, map, Observable, switchMap } from 'rxjs';
import { UserDto } from 'src/users/dto/user.dto';
import { ProjectDto } from '../dto/project.dto';
import { ProjectResponseDto } from '../dto/project-response.dto';
import { IPaginationOptions, paginate, paginateRawAndEntities, Pagination } from 'nestjs-typeorm-paginate';
import { SearchProjectsFilters } from '../dto/search-projects-filters.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Injectable()
export class ProjectsService {

  constructor(@InjectRepository(ProjectEntity)
              private projectsRepository: Repository<ProjectEntity>,
              private usersService: UsersService) {}

  create(imageName: string | undefined, createProjectDto: CreateProjectDto, userId: number): Observable<ProjectDto> {
    return this.usersService.findOneById(userId).pipe(
      switchMap((user: UserDto) => {
        const projectEntity = this.createProjectEntity(imageName, createProjectDto);
        projectEntity.createdBy = user;
        return from(this.projectsRepository.save(projectEntity));
      })
    )
  }

  createProjectEntity(imageName: string | undefined, createProjectDto: CreateProjectDto): ProjectEntity {
    const projectEntity = this.projectsRepository.create();
    projectEntity.image = imageName;
    projectEntity.title = createProjectDto.title;
    projectEntity.description = createProjectDto.description;
    projectEntity.requirements = createProjectDto.requirements;
    projectEntity.tags = createProjectDto.tags;
    return projectEntity;
  }

  findSuggestedProjectsForUser(userId: number): Observable<ProjectResponseDto[]> {
    return this.usersService.findTagsIdsForUser(userId).pipe(
      filter((tagsIds: number[]) => tagsIds.length > 0),
      switchMap((tagsIds: number[]) => {
        return this.projectsRepository
          .createQueryBuilder('project')
          .innerJoinAndSelect('project.tags', 'tag')
          .innerJoinAndSelect('project.createdBy', 'createdBy')
          .where("tag.id IN (:...tagsIds) AND createdBy.id != :userId AND project.status = 'opened'", { tagsIds, userId })
          .orderBy('project.createdAt', 'DESC')
          .take(8)
          .getMany();
      }),
      defaultIfEmpty([])
    )
  }

  findManyPaginated(options: IPaginationOptions, filters: SearchProjectsFilters): Observable<Pagination<ProjectResponseDto>> {
    if(!filters.title)
      filters.title = '';

    if(!filters.minDate)
      filters.minDate = new Date(0);

    let queryBuilder = this.projectsRepository
                        .createQueryBuilder('project')
                        .innerJoinAndSelect('project.createdBy', 'createdBy')
                        .where('LOWER(project.title) LIKE :title', { title: `%${filters.title.toLowerCase()}%` })
                        .andWhere('(project.createdAt >= :minDate OR project.updatedAt >= :minDate)', { minDate: filters.minDate })

    if(filters.tagsIds.length > 0) {
      queryBuilder.innerJoinAndSelect('project.tags', 'tag')
                  .andWhere('tag.id IN (:...tagsIds)', { tagsIds: filters.tagsIds })
    }

    queryBuilder.orderBy('project.updatedAt', 'DESC');
                 
    return from(paginate<ProjectResponseDto>(queryBuilder, options));
  }

  findOne(id: number): Observable<ProjectResponseDto> {
    return from(this.projectsRepository.findOne({
      where: {id},
      relations: ['createdBy', 'tags']
    }))
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
