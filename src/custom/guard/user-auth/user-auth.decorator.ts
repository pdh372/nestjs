import { ExecutionContext, SetMetadata, UseGuards, applyDecorators, createParamDecorator } from '@nestjs/common';
// import { IAppReq } from '@interface/express.interface';
import { UserJwtGuard } from './user-auth.guard';
import { USER_JWT_GUARD_KEY } from './user-auth.constant';
import { IUserAuthDecorator } from './user-auth.interface';

export const UserDecorator = createParamDecorator((_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<IAppReq>();
    return req.user;
});

export function UserAuthGuard(params?: IUserAuthDecorator) {
    if (!params) params = { selected: '' };
    return applyDecorators(SetMetadata(USER_JWT_GUARD_KEY, params), UseGuards(UserJwtGuard));
}
