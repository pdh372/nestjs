import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MorganInterceptor } from '@custom/interceptor.custom';
import { MongodbModule } from '@repository/mongodb/mongodb.module';
import { RouterModule } from '@router/router.module';
import { ConfigModule } from '@nestjs/config';
import { APP_DATA_CONFIG, ENV_FILE_PATH } from '@constant/config.const';
import { MyValidationPipe } from '@custom/pipe.custom';
import { DataBaseModule } from '@helper/database.helper';
import { AppService } from './app.service';
import { validateEnvironment } from '@helper/validateEnv.helpers';
import { GatewayModule } from '@src/module/gateway/gateway.module';
import { SOCKET_PROVIDERS } from '@socket/index.socket';
import { RedisModule } from '@module/redis/redis.module';
import * as INJECT_TOKEN from '@constant/injectionToken.const';
@Module({
    imports: [
        // config
        ConfigModule.forRoot({
            validate: validateEnvironment,
            envFilePath: ENV_FILE_PATH,
            isGlobal: true,
            load: [APP_DATA_CONFIG],
            expandVariables: true,
        }),

        // database
        // mongodb
        DataBaseModule.registerMongodb(),
        MongodbModule,
        // redis
        DataBaseModule.registerRedis(),

        // routes
        RouterModule,
        // MainModule,

        // lesson: module
        // MyDynamicModule.forRoot('database'),
        // GameModule,

        // Socket
        GatewayModule.forRoot({
            providers: SOCKET_PROVIDERS,
        }),

        RedisModule.forRoot({
            configs: [
                { it: INJECT_TOKEN.REDIS.ADAPTER },
                { it: INJECT_TOKEN.REDIS.WRITER },
                { it: INJECT_TOKEN.REDIS.THROTTLER },
            ],
        }),
    ],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: MorganInterceptor,
        },
        {
            provide: APP_PIPE,
            useClass: MyValidationPipe,
        },
    ],
})
export class AppModule {}
