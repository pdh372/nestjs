import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MorganInterceptor } from '@custom/interceptor.custom';
import { ModelModule } from '@repository/mongodb/mongodb.module';
import { RouterModule } from '@router/router.module';
import { ConfigModule } from '@nestjs/config';
import { APP_DATA_CONFIG, ENV_FILE_PATH } from '@constant/config.const';
import { MyValidationPipe } from '@custom/pipe.custom';
import { DataBaseModule } from '@helper/database.helper';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validateEnvironment } from '@helper/validateEnv.helpers';
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
        DataBaseModule.registerMongodb(),
        ModelModule,

        // rate - limit
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 100,
        }),

        // routes
        RouterModule,
        // MainModule,

        // lesson: module
        // MyDynamicModule.forRoot('database'),
        // GameModule,
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
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
