import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { UserPublicController } from '@router/user/controller/user-public.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserAuthController } from '@router/user/controller/user-auth.controller';

@Module({
    controllers: [UserPublicController, UserAuthController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
    ],
})
export class UserModule {}
