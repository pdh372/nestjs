import { Module, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core';
import { MorganInterceptor } from '@interceptor/morgan';
import { MongodbModule } from '@repository/mongodb/mongodb.module';
import { ApiModule } from '@api/api.module';
import { ConfigModule } from '@nestjs/config';
import { APP_DATA_CONFIG, ENV_FILE_PATH } from '@constant/config.const';
import { DataBaseModule } from '@helper/database.helper';
import { AppService } from 'src/app.service';
import { validateEnvironment } from '@helper/validate-env.helpers';
import { GatewayModule } from '@module/gateway/gateway.module';
import { SOCKET_PROVIDERS } from '@socket/index.socket';
import { RedisModule } from '@module/redis/redis.module';
import * as INJECT_TOKEN from '@constant/injection-token.const';
import { AllHttpException } from '@exception/global.exception';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobService } from '@module/cronJob/cronJob.service';
@Module({
    imports: [
        // ENV
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

        // Controller
        ApiModule,

        // Socket
        GatewayModule.forRoot({
            providers: SOCKET_PROVIDERS,
        }),

        // Cache
        RedisModule.forRoot({
            configs: [
                { it: INJECT_TOKEN.REDIS.ADAPTER },
                { it: INJECT_TOKEN.REDIS.WRITER },
                { it: INJECT_TOKEN.REDIS.THROTTLER },
            ],
        }),

        // Cron Job
        ScheduleModule.forRoot(),
    ],
    providers: [
        AppService,
        CronJobService,
        {
            provide: APP_INTERCEPTOR,
            useClass: MorganInterceptor,
        },
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
                transform: true,
                forbidNonWhitelisted: true,
                validateCustomDecorators: false, // If true maybe bug when set return req.user
            }),
        },
        {
            provide: APP_FILTER,
            useClass: AllHttpException,
        },
    ],
})
export class AppModule {}
