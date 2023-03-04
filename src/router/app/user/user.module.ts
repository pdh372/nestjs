import { Module } from '@nestjs/common';
import { UserController } from '@router/app/user/user.controller';

@Module({
    controllers: [UserController],
})
export class UserModule {}
