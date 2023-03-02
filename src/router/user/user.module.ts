import { Module } from '@nestjs/common';
import { UserController } from '@router/user/user.controller';

@Module({
    controllers: [UserController],
})
export class UserModule {}
