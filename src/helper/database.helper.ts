import { DynamicModule, Module } from '@nestjs/common';
import { ConnectMongodbModule } from './connectMongodb.helper';

@Module({})
export class DataBaseModule {
    static registerMongodb(): DynamicModule {
        return {
            module: ConnectMongodbModule,
        };
    }

    // static registerPostgres(): DynamicModule {
    //     return {
    //         module: PostgresModule,
    //     };
    // }
}
