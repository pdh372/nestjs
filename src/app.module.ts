import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MorganInterceptor } from '@custom/interceptor';

import { RepositoryModule } from '@repository/repository.module';
import { RouterModule } from '@router/router.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GLOBAL_CONFIG, ENV_FILE_PATH } from '@constant/config.const';
import { MyValidationPipe } from 'src/custom/pipe';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ENV_FILE_PATH,
            isGlobal: true,
            load: [APP_GLOBAL_CONFIG],
        }),
        RepositoryModule,
        RouterModule,
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
        // {
        //     provide: APP_PIPE,
        //     useValue: new ValidationPipe({
        //         // disableErrorMessages: true,
        //         transform: true,
        //         whitelist: true,
        //     }),
        // },
    ],
})
export class AppModule {}
