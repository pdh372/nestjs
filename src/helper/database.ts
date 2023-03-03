import { DynamicModule, Module } from '@nestjs/common';
import { ConnectMongodb } from './mongodb';

@Module({})
export class DataBaseModule {
    static registerMongodb(): DynamicModule {
        return {
            module: ConnectMongodb,
        };
    }

    // static registerRedis(): DynamicModule {
    //     return {
    //         module: RedisModule,
    //     };
    // }
}
