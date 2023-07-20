import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleType } from "@prisma/client";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorators/roles.decorator";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){};

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if(!requiredRoles){
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user.role.role);
    }
}