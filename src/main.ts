// import '@router/app/template/2_provider/mindset';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { LOGGERS } from '@constant/config.const';
import { appColor } from '@helper/chalk.helper';
import { AppService } from '@src/app.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: LOGGERS,
    });
    const appService = app.get(AppService);

    // middlewares
    app.enableCors(appService.corsOption);
    app.use(appService.middlewares);
    app.useWebSocketAdapter(await appService.createAdapter(app));

    await app.listen(appService.port, async () => {
        const url = await app.getUrl();
        appColor(`🍺 Server is running ${appService.env} - ${url}`);
    });
}
bootstrap();
