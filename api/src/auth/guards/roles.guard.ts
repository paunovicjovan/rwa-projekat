import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UsersService } from "src/users/service/users.service";
import { UserRoles } from "src/users/enums/user-roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector,
                private usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if(!requiredRoles)
            return true;

        const request = context.switchToHttp().getRequest();

        const user = await this.usersService.findOneById(request.user.id)

        const hasPermission = requiredRoles.indexOf(user.role) > -1;
        
        return user && hasPermission;
    }

}