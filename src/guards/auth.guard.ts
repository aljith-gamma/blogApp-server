import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwt: JwtService,
        private prisma: PrismaService
    ) {};

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Unauthorized user!');
        }

        try {
            const payload = await this.jwt.verifyAsync(token);
            const { id, role } = payload;
            let user: any = await this.prisma.user.findUnique({
                where: { id },
                include: { role: true }
            })

            if(!user) return false;
            
            request.user = user;

        } catch (error) {
            throw new UnauthorizedException('Unauthorized user!');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined{
        const [type, token] = request.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}