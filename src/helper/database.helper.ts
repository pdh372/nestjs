import { DynamicModule, Module } from '@nestjs/common';
import { ConnectMongodbModule } from './connect-mongodb.helper';

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
