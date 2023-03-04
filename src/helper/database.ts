import { DynamicModule, Module } from '@nestjs/common';
import { ConnectMongodbModule } from './mongodb';

@Module({})
export class DataBaseModule {
    static registerMongodb(): DynamicModule {
        return {
            module: ConnectMongodbModule,
        };
    }

    // static registerRedis(): DynamicModule {
    //     return {
    //         module: RedisModule,
    //     };
    // }
}
