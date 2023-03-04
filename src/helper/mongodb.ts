/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InjectConnection, MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { appColor } from '@helper/chalk';
import { Connection } from 'mongoose';
import { IConfigService } from '@interface/config.interface';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (config: IConfigService): MongooseModuleFactoryOptions => {
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
export class ConnectMongodbModule implements OnModuleInit {
    constructor(
        // @ts-ignore
        @InjectConnection() private readonly connection: Connection,
        @Inject(ConfigService) private readonly configService: IConfigService,
    ) {}

    onModuleInit() {
        this.connection.set('debug', this.configService.get('debug_mongoose_transaction'));
        const str = `${this.connection.host}:${this.connection.port}/${this.connection.db.namespace}`;
        appColor(`🍺 mongodb connected! mongodb://${str}`);
    }
}
