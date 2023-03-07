import { LogLevel } from '@nestjs/common';
import { IAppConfig } from '@interface/config.interface';
import { INodeENV } from '@interface/config.interface';

export const APP_DATA_CONFIG = (): IAppConfig => ({
    node_env: (process.env.NODE_ENV || 'development') as INodeENV,
    port: parseInt(process.env.PORT || '3000', 10),
    cors_origins: process.env.CORS_ORIGINS || '*',

    debug_mongoose_transaction: process.env.DEBUG_MONGOOSE_TRANSACTION === 'true',
    debug_mongoose_model: process.env.DEBUG_MONGOOSE_MODEL === 'true',
    debug_global_pipe: process.env.DEBUG_GLOBAL_PIPE === 'true',
    debug_global_interceptor: process.env.DEBUG_GLOBAL_INTERCEPTOR === 'true',

    mongodb_url: process.env.MONGODB_URI || 'mongodb://localhost:27017/init-nestjs',

    cipher_key: process.env.CIPHER_KEY || '1111_2222_3333_4444_5555_6666_77',
    cipher_iv: process.env.CIPHER_IV || '11_22_33_44_55_6',

    useragent: process.env.USERAGENT === 'true',
    compression: process.env.compression === 'true',
    session_secret: process.env.SESSION_SECRET || 'give-secret-session-here',
    session_name: process.env.SESSION_NAME,
    session_cookie_max_age: parseInt(process.env.SESSION_COOKIE_MAX_AGE || (30 * 24 * 60 * 60 * 1000).toString(), 10),
    session_store_expire: parseInt(process.env.SESSION_STORE_EXPIRE || (2 * 30 * 24 * 60 * 60).toString(), 10),
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
