import { ExecutionContext, SetMetadata, UseGuards, applyDecorators, createParamDecorator } from '@nestjs/common';
import { UserATGuard } from './at.guard';
import { USER_AT_KEY } from './at.constant';

export const UserAccessTokenDecorator = createParamDecorator((_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<IAppReq>();
    return req.user;
});

export function UserAccessTokenGuard() {
    return applyDecorators(SetMetadata(USER_AT_KEY, {}), UseGuards(UserATGuard));
}
