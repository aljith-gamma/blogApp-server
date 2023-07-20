
import { RoleType  } from "@prisma/client";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);