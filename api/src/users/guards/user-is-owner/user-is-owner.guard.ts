import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserIsOwnerGuard implements CanActivate {
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const realUserId = request.user.id;

    const params = request.params;
    const userIdFromRoute: number = params.id;

    return realUserId == userIdFromRoute;
  }
}
