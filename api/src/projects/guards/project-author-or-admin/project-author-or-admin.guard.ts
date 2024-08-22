import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProjectsService } from 'src/projects/service/projects.service';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class ProjectAuthorOrAdminGuard implements CanActivate {
  constructor(
    private projectsService: ProjectsService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const projectId: number = params.id;
    const userId: number = request.user.id;

    const user = await this.usersService.findOneById(userId);
    const project = await this.projectsService.findOne(projectId);

    const isAdmin = user.role === UserRoles.ADMIN;
    const isAuthor = user.id === project.createdBy.id;
    const hasPermission = isAdmin || isAuthor;

    return hasPermission;
  }
}
