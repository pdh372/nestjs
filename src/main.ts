if (!process.env.IS_TS_NODE) {
    require('module-alias/register');
}
import validateEnv from '@helper/validateEnv';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { LOGGERS } from '@constant/config.const';
// import '@module/template/2_provider/mindset';

async function bootstrap() {
    validateEnv();
    const app = await NestFactory.create(AppModule, {
        logger: LOGGERS,
    });
    await app.listen(3000);
}
bootstrap();
