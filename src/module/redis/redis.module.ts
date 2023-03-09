import { DynamicModule, Module } from '@nestjs/common';
import { ICreateNewInstance } from '@module/redis/redis.interface';
import { hashToken } from '@module/redis/redis.helper';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
    static forFeature(createNewInstance: ICreateNewInstance): DynamicModule {
        const token = hashToken(createNewInstance.inject_token);

        return {
            module: RedisModule,
            providers: [
                RedisService,
                {
                    provide: token,
                    useFactory: (redisService: RedisService) => {
                        return redisService.newRedisClient(createNewInstance);
                    },
                    inject: [RedisService],
                },
            ],
            exports: [token],
        };
    }
}
