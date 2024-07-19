import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRoles } from "src/users/dto/user.dto";
import { UsersService } from "src/users/service/users.service";
import { ReturnUserDto } from "src/users/dto/return-user.dto";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector,
                private usersService: UsersService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if(!requiredRoles)
            return true;

        const { user } = context.switchToHttp().getRequest();

        return this.usersService.findOneById(user.id)
        .pipe(
            map((user:ReturnUserDto)=>{
                const hasPermission = requiredRoles.indexOf(user.role) > -1;
                return user && hasPermission;
            })
        )
    }

}