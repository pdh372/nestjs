import { ExecutionContext, SetMetadata, UseGuards, applyDecorators, createParamDecorator } from '@nestjs/common';
import { UserATGuard } from './at.guard';
import { USER_AT_KEY } from './at.constant';
import { IUserATDecorator } from './at.interface';

export const UserAccessTokenDecorator = createParamDecorator((_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<IAppReq>();
    return req.user;
});

export function UserAccessTokenGuard(params?: IUserATDecorator) {
    if (!params) params = { isLean: false };
    return applyDecorators(SetMetadata(USER_AT_KEY, params), UseGuards(UserATGuard));
}
