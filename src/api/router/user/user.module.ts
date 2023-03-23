import { Module } from '@nestjs/common';
import { PublicController } from '@router/user/controller/public.controller';

@Module({
    controllers: [PublicController],
})
export class UserModule {}
