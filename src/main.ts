if (!process.env.IS_TS_NODE) {
    require('module-alias/register');
}
// import '@router/app/template/2_provider/mindset';

import { validateEnv } from '@helper/validateEnv.helpers';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LOGGERS } from '@constant/config.const';
import { appColor } from '@helper/chalk.helper';
import { AppService } from './app.service';

async function bootstrap() {
    validateEnv();
    const app = await NestFactory.create(AppModule, {
        logger: LOGGERS,
    });
    const appService = app.get(AppService);

    // middlewares
    app.enableCors(appService.corsOption);
    app.use(appService.middlewares);

    await app.listen(appService.port, async () => {
        const url = await app.getUrl();
        appColor(`🍺 Server is running ${appService.env} - ${url}`);
    });
}
bootstrap();
