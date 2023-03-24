import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { AuthService } from '@src/api/service/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { USER_JWT_GUARD_KEY } from './user-auth.constant';
import { IUserAuthDecorator } from './user-auth.interface';

@Injectable()
export class UserJwtGuard implements CanActivate {
    constructor(private authService: AuthService, private models: MongodbService, private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest<IAppReq>();
            const accessToken = req.headers.authorization && req.headers.authorization.slice(7);
            if (!accessToken) throw new Error('AccessToken not found');
            const decoded = this.authService.verifyUserAccessToken({ accessToken });
            if (!decoded) throw new Error('AccessToken invalid.');

            const reflector = this.reflector.get<IUserAuthDecorator>(USER_JWT_GUARD_KEY, context.getHandler());
            const user = await this.models.User.findById(decoded._id, reflector.selected || '');
            if (!user) throw new Error('No user');
            req.user = user;

            return true;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }
}