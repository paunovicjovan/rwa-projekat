import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '../entities/project.entity';
import { Not, Repository } from 'typeorm';
import { UsersService } from 'src/users/service/users.service';
import { ProjectDto } from '../dto/project.dto';
import { ProjectResponseDto } from '../dto/project-response.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { SearchProjectsFilters } from '../dto/search-projects-filters.dto';
import { ProjectStatus } from '../enums/project-status.enum';
import * as fs from 'fs';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class ProjectsService {

  constructor(@InjectRepository(ProjectEntity)
              private projectsRepository: Repository<ProjectEntity>,
              @Inject(forwardRef(() => UsersService))
              private usersService: UsersService) {}

  async create(imageName: string | undefined, createProjectDto: CreateProjectDto, userId: number): Promise<ProjectDto> {
    const user = await this.usersService.findOneById(userId);
    const projectEntity = this.createProjectEntity(imageName, createProjectDto);
    projectEntity.createdBy = user;
    return await this.projectsRepository.save(projectEntity);
  }

  private createProjectEntity(imageName: string | undefined, createProjectDto: CreateProjectDto): ProjectEntity {
    const projectEntity = this.projectsRepository.create();
    projectEntity.image = imageName;
    projectEntity.title = createProjectDto.title;
    projectEntity.description = createProjectDto.description;
    projectEntity.requirements = createProjectDto.requirements;
    projectEntity.tags = createProjectDto.tags;
    return projectEntity;
  }

  async findSuggestedProjectsForUser(userId: number): Promise<ProjectResponseDto[]> {
    const tagsIds = await this.usersService.findTagsIdsForUser(userId);
    if(tagsIds.length === 0)
      return [];

    return await this.projectsRepository
          .createQueryBuilder('project')
          .innerJoinAndSelect('project.tags', 'tag')
          .innerJoinAndSelect('project.createdBy', 'createdBy')
          .where("tag.id IN (:...tagsIds) AND createdBy.id != :userId AND project.status = 'opened'", { tagsIds, userId })
          .orderBy('project.createdAt', 'DESC')
          .take(8)
          .getMany();
  }

  async findManyPaginated(options: IPaginationOptions, filters: SearchProjectsFilters): Promise<Pagination<ProjectResponseDto>> {
    if(!filters.title)
      filters.title = '';

    if(!filters.minDate)
      filters.minDate = new Date(0);

    let queryBuilder = this.projectsRepository
                        .createQueryBuilder('project')
                        .innerJoinAndSelect('project.createdBy', 'createdBy')
                        .where('LOWER(project.title) LIKE :title', { title: `%${filters.title.toLowerCase()}%` })
                        .andWhere("project.status = 'opened'")
                        .andWhere('(project.createdAt >= :minDate OR project.updatedAt >= :minDate)', { minDate: filters.minDate })

    if(filters.tagsIds.length > 0) {
      queryBuilder.innerJoinAndSelect('project.tags', 'tag')
                  .andWhere('tag.id IN (:...tagsIds)', { tagsIds: filters.tagsIds })
    }

    queryBuilder.orderBy('project.updatedAt', 'DESC');
                 
    return paginate<ProjectResponseDto>(queryBuilder, options);
  }

  async findOne(id: number): Promise<ProjectDto> {
    return await this.projectsRepository.findOne({
      where: {id},
      relations: ['createdBy', 'tags']
    })
  }

  async updateProjectImage(projectId: number, newImageName: string | null) : Promise<ProjectResponseDto> {
    await this.deleteProjectImageFromFileSystem(projectId);
    return await this.update(projectId, {image: newImageName});
}

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<ProjectResponseDto> {
    await this.projectsRepository.update(id, updateProjectDto);
    return await this.findOne(id);
  }

  async deleteOne(id: number): Promise<any> {
    const project = await this.projectsRepository.findOne({where: {id}});
    project.tags = [];
    project.appliedBy = [];
    project.acceptedUsers = [];
    await this.projectsRepository.save(project);
    await this.deleteProjectImageFromFileSystem(id);
    return await this.projectsRepository.delete(id);
  }

  async deleteManyByAuthorId(userId: number): Promise<any> {
    const projectsToDelete = await this.projectsRepository.find({
      where: {
        createdBy: {
          id: userId
        }
      }
    });
    projectsToDelete.forEach(project => {
      project.tags = [];
      project.appliedBy = [];
      project.acceptedUsers = [];
    })

    await this.projectsRepository.save(projectsToDelete);
    return await this.projectsRepository.remove(projectsToDelete);
  }

  private async deleteProjectImageFromFileSystem(projectId: number): Promise<ProjectResponseDto> {
    const project = await this.findOne(projectId);
    if(project.image !== null) {
      const projectImagePath = `./uploads/project-images/${project.image}`;
      fs.unlinkSync(projectImagePath);
    }
    return project;
}

  async findAppliedProjectsForUser(username: string, options: IPaginationOptions): Promise<Pagination<ProjectResponseDto>> {
    return await paginate(this.projectsRepository, options, {
      where: {
        appliedBy: { username }
      },
      relations: ['createdBy'],
      order: { updatedAt: 'DESC' }
    })
  }

  async findAcceptedProjectsForUser(username: string, isCompleted: boolean, options: IPaginationOptions): Promise<Pagination<ProjectResponseDto>> {
    return await paginate(this.projectsRepository, options, {
      where: {
        acceptedUsers: { username },
        status: isCompleted ? ProjectStatus.COMPLETED : Not(ProjectStatus.COMPLETED)
      },
      relations: ['createdBy'],
      order: { updatedAt: 'DESC' }
    })
  }

  async findCreatedProjectsForUser(username: string, status: ProjectStatus, options: IPaginationOptions): Promise<Pagination<ProjectResponseDto>> {
    return await paginate(this.projectsRepository, options, {
      where: {
        createdBy: { username },
        status: status
      },
      relations: ['createdBy'],
      order: { updatedAt: 'DESC' }
    })
  }

  async canUserApply(userId: number, projectId: number): Promise<boolean> {
    const project = await this.projectsRepository.findOne({
      where: {id: projectId},
      relations: ['createdBy', 'appliedBy', 'acceptedUsers']
    });
    const hasUserApplied = project.appliedBy.some((user: UserDto) => user.id == userId);
    const isUserAccepted = project.acceptedUsers.some((user: UserDto) => user.id == userId);
    const isUserAuthor = project.createdBy.id === userId;
    const canApply = !hasUserApplied && !isUserAccepted && !isUserAuthor;
    return canApply;
  }

}
