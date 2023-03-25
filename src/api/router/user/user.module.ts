import { Module } from '@nestjs/common';
import { UserPublicController } from '@router/user/controller/user-public.controller';
import { UserAuthController } from '@router/user/controller/user-auth.controller';

@Module({
    controllers: [UserPublicController, UserAuthController],
    providers: [],
})
export class UserModule {}
