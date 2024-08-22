import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ProjectsService } from 'src/projects/service/projects.service';

@Injectable()
export class UserIsProjectAuthorGuard implements CanActivate {

  constructor(private projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const projectId: number = params.id;
    const userId: number = request.user.id;
   
    const project = await this.projectsService.findOne(projectId);
    const hasPermission = project.createdBy.id == userId;
    return hasPermission;
  }
}
