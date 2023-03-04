import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MorganInterceptor } from '@custom/interceptor';
import { ModelMongodbModule } from '@repository/mongodb/index.model';
import { RouterModule } from '@router/router.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GLOBAL_CONFIG, ENV_FILE_PATH } from '@constant/config.const';
import { MyValidationPipe } from '@custom/pipe';
import { DataBaseModule } from '@helper/database';

import { MainModule } from '@router/template/3_module/basic/main.module';

@Module({
    imports: [
        // config
        ConfigModule.forRoot({
            envFilePath: ENV_FILE_PATH,
            isGlobal: true,
            load: [APP_GLOBAL_CONFIG],
        }),

        // database
        DataBaseModule.registerMongodb(),
        ModelMongodbModule,

        // routes
        RouterModule,
        MainModule,

        // lesson: module
        // MyDynamicModule.forRoot('database'),
        // GameModule,
    ],
    providers: [
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
