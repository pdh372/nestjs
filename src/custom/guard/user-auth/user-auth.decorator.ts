import { ExecutionContext, SetMetadata, UseGuards, applyDecorators, createParamDecorator } from '@nestjs/common';
import { UserATGuard } from './user-auth.guard';
import { USER_AUTH_KEY } from './user-auth.constant';
import { IUserAuthDecorator } from './user-auth.interface';

export const UserDecorator = createParamDecorator((_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<IAppReq>();
    return req.user;
});

export function UserAuth(params?: IUserAuthDecorator) {
    if (!params) params = { selected: '' };
    return applyDecorators(SetMetadata(USER_AUTH_KEY, params), UseGuards(UserATGuard));
}
