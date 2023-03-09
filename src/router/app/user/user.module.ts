import { Module } from '@nestjs/common';
import { UserController } from '@router/app/user/user.controller';
import { RedisModule } from '@module/redis/redis.module';

@Module({
    imports: [RedisModule.forFeature({ inject_token: 'first' })],
    controllers: [UserController],
})
export class UserModule {}
