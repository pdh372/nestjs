/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InjectConnection, MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { RepositoryService } from '@repository/repository.service';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { IAppConfig } from '@interface/config.interface';

// models
import { User, UserSchema } from './model/user.model';

@Global()
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

        // import models here:
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [RepositoryService],
    exports: [RepositoryService],
})
export class RepositoryModule implements OnModuleInit {
    // @ts-ignore
    constructor(@InjectConnection() private connection: Connection, private config: ConfigService<IAppConfig>) {}

    onModuleInit() {
        this.connection.set('debug', this.config.get('debug_mongoose'));

        console.info(
            `🍺 mongodb connected! mongodb://${this.connection.host}:${this.connection.port}/${this.connection.db.namespace}\n`,
        );
    }
}
