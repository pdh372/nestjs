if (!process.env.IS_TS_NODE) {
    require('module-alias/register');
}
// import '@module/template/2_provider/mindset';

import { validateEnv } from '@helper/validateEnv.helpers';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LOGGERS } from '@constant/config.const';
import { ConfigService } from '@nestjs/config';
import { appColor } from '@helper/chalk.helper';
import { IConfigService } from '@interface/config.interface';

async function bootstrap() {
    validateEnv();

    const app = await NestFactory.create(AppModule, {
        logger: LOGGERS,
    });

    const config: IConfigService = app.get(ConfigService);
    const env = config.get('node_env');
    await app.listen(+config.get('port'), async () => {
        const url = await app.getUrl();
        appColor(`🍺 Server is running ${env} - ${url}`);
    });
}
bootstrap();
