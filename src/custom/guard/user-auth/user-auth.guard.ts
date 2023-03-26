import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { AuthService } from '@src/service/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { USER_AUTH_KEY } from './user-auth.constant';
import { IUserAuthDecorator } from './user-auth.interface';
import { ERROR_AUTH } from 'src/constant/error.const';

@Injectable()
export class UserATGuard implements CanActivate {
    constructor(private authService: AuthService, private models: MongodbService, private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest<IAppReq>();
            const accessToken = req.headers.authorization && req.headers.authorization.slice(7);
            if (!accessToken) throw new Error('AccessToken not found.');
            const decoded = this.authService.verifyUserAccessToken({ accessToken });
            if (!decoded) throw new Error('AccessToken invalid.');

            const reflector = this.reflector.get<IUserAuthDecorator>(USER_AUTH_KEY, context.getClass());
            const user = await this.models.User.findById(decoded._id, reflector.selected || '');
            if (!user) throw new Error('No user');
            req.user = user;

            return true;
        } catch (error) {
            if (error?.message === ERROR_AUTH.TOKEN_EXPIRED) {
                throw new UnauthorizedException({ info: ERROR_AUTH.TOKEN_EXPIRED });
            }

            throw new UnauthorizedException({ info: ERROR_AUTH.INVALID_TOKEN });
        }
    }
}
