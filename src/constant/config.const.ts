import { LogLevel } from '@nestjs/common';
import { IAppConfig } from '@interface/config.interface';
import { INodeENV } from '@interface/config.interface';

export const APP_DATA_CONFIG = (): IAppConfig => ({
    app_name: process.env.APP_NAME,
    node_env: process.env.NODE_ENV as INodeENV,
    port: +(process.env.PORT || 0),
    cors_origins: process.env.CORS_ORIGINS,

    debug_mongoose_transaction: process.env.DEBUG_MONGOOSE_TRANSACTION === 'true',
    debug_mongoose_model: process.env.DEBUG_MONGOOSE_MODEL === 'true',
    debug_global_pipe: process.env.DEBUG_GLOBAL_PIPE === 'true',
    debug_global_interceptor: process.env.DEBUG_GLOBAL_INTERCEPTOR === 'true',

    mongodb_url: process.env.MONGODB_URI,

    cipher_key: process.env.CIPHER_KEY,
    cipher_iv: process.env.CIPHER_IV,

    useragent: process.env.USERAGENT === 'true',
    compression: process.env.compression === 'true',
    session_secret: process.env.SESSION_SECRET,
    session_name: process.env.SESSION_NAME,
    session_cookie_max_age: +(process.env.SESSION_COOKIE_MAX_AGE || 0),
    session_store_expire: +(process.env.SESSION_STORE_EXPIRE || 0),

    redis_url: process.env.REDIS_URL,
    redis_database: +(process.env.REDIS_DATABASE || 0),
});

export const LOGGERS: LogLevel[] = ['error', 'warn', 'verbose', 'debug'];

export enum ENV {
    Development = 'development',
    Production = 'production',
    Staging = 'staging',
    Pentest = 'pentest',
}

export const ENV_FILE_PATH = [
    `.env.${ENV.Development}`,
    `.env.${ENV.Staging}`,
    `.env.${ENV.Pentest}`,
    `.env.${ENV.Production}`,
];
