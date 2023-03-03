/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InjectConnection, MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IAppConfig } from '@interface/config.interface';
import { Module, OnModuleInit } from '@nestjs/common';
import { appColor } from '@helper/chalk';
import { Connection } from 'mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService<IAppConfig>): MongooseModuleFactoryOptions => {
                return {
                    uri: config.get('mongodb_url'),
                    autoIndex: true,
                    autoCreate: true,
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class ConnectMongodb implements OnModuleInit {
    // @ts-ignore
    constructor(@InjectConnection() private connection: Connection, private config: ConfigService<IAppConfig>) {}

    onModuleInit() {
        this.connection.set('debug', this.config.get('debug_mongoose_transaction'));
        const str = `${this.connection.host}:${this.connection.port}/${this.connection.db.namespace}`;
        appColor(`🍺 mongodb connected! mongodb://${str}`);
    }
}
