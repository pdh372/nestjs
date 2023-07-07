import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MongodbService } from 'src/model';
import { AuthService } from '@service/auth/auth.service';
import { ERROR_AUTH } from '@constant/error.const';

@Injectable()
export class UserATGuard implements CanActivate {
    constructor(private authService: AuthService, private models: MongodbService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest<IAppReq>();
            const accessToken = req.headers.authorization && req.headers.authorization.slice(7);
            if (!accessToken) throw new Error('AccessToken not found.');
            const decoded = this.authService.verifyUserAccessToken({ accessToken });
            if (!decoded) throw new Error('AccessToken invalid.');

            const user = await this.models.User.findById(decoded._id);

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
