import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MongodbService } from '@module/mongodb/mongodb.service';
import { AuthService } from '@service/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { USER_AT_KEY } from './at.constant';
import { IUserATDecorator } from './at.interface';
import { ERROR_AUTH } from '@constant/error.const';

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

            const reflector = this.reflector.get<IUserATDecorator>(USER_AT_KEY, context.getHandler());

            const user = reflector.isLean
                ? await this.models.User.findById(decoded._id).lean()
                : await this.models.User.findById(decoded._id);

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
