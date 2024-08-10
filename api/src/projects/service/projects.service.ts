import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '../entities/project.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/service/users.service';
import { from, Observable, switchMap } from 'rxjs';
import { UserDto } from 'src/users/dto/user.dto';
import { ProjectDto } from '../dto/project.dto';

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

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
