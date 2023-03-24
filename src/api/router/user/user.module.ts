import { Module } from '@nestjs/common';
import { UserPublicController } from '@router/user/controller/user-public.controller';

@Module({
    controllers: [UserPublicController],
    providers: [],
})
export class UserModule {}
