import { DynamicModule, Module } from '@nestjs/common';
import { ConnectMongodbModule } from './connectMongodb.helper';
import { RedisModule } from '@module/redis/redis.module';

@Module({})
export class DataBaseModule {
    static registerMongodb(): DynamicModule {
        return {
            module: ConnectMongodbModule,
        };
    }

    static registerRedis(): DynamicModule {
        return {
            module: RedisModule,
        };
    }
}
