if (!process.env.IS_TS_NODE) {
    require('module-alias/register');
}
import validateEnv from '@helper/validateEnv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { LOGGERS } from '@constant/config.const';
// import '@module/template/2_provider/mindset';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '@interface/config.interface';
import { appColor } from 'src/helper/chalk';

async function bootstrap() {
    validateEnv();

    const app = await NestFactory.create(AppModule, {
        logger: LOGGERS,
    });

    const config = app.get(ConfigService<IAppConfig>);
    const env = config.get('node_env');
    await app.listen(+config.get('port'), async () => {
        const url = await app.getUrl();
        appColor(`🍺 Server is running ${env} - ${url}`);
    });
}
bootstrap();
