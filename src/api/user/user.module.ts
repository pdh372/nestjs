import { Module } from '@nestjs/common';
import { UserPublicController } from '@api/user/controller/user-public.controller';
import { UserAuthController } from '@api/user/controller/user-auth.controller';

@Module({
    controllers: [UserPublicController, UserAuthController],
    providers: [],
})
export class UserModule {}
