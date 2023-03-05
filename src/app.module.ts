import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MorganInterceptor } from '@src/custom/interceptor.custom';
import { ModelModule } from '@repository/mongodb/mongodb.module';
import { RouterModule } from '@router/router.module';
import { ConfigModule } from '@nestjs/config';
import { APP_DATA_CONFIG, ENV_FILE_PATH } from '@constant/config.const';
import { MyValidationPipe } from '@src/custom/pipe.custom';
import { DataBaseModule } from '@helper/database.helper';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
@Module({
    imports: [
        // config
        ConfigModule.forRoot({
            envFilePath: ENV_FILE_PATH,
            isGlobal: true,
            load: [APP_DATA_CONFIG],
        }),

        // database
        DataBaseModule.registerMongodb(),
        ModelModule,

        // rate - limit
        ThrottlerModule.forRoot({
            ttl: 10,
            limit: 5,
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
