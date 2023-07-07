import { LogLevel } from '@nestjs/common';

export const ENV = {
    dev: 'development',
    prod: 'production',
    staging: 'staging',
};

export const LOGGERS: LogLevel[] = ['error', 'warn', 'verbose', 'debug'];

export const ENV_FILE_PATH = [`.env.${ENV.dev}`, `.env.${ENV.staging}`, `.env.${ENV.prod}`];

export const APP_DATA_CONFIG = () => {
    return {
        app_name: process.env.APP_NAME,
        node_env: process.env.NODE_ENV as ConstValue<typeof ENV>,
        port: +(process.env.PORT || 0),
        cors_origins: process.env.CORS_ORIGINS,

        debug_mongoose_transaction: process.env.DEBUG_MONGOOSE_TRANSACTION === 'true',
        debug_mongoose_model: process.env.DEBUG_MONGOOSE_MODEL === 'true',
        debug_global_request_data: process.env.DEBUG_GLOBAL_REQUEST_DATA === 'true',
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

        refresh_token: {
            user: {
                private_key: Buffer.from(process.env.JWT_PRIVATE_KEY || '', 'base64'),
                public_key: Buffer.from(process.env.JWT_PUBLIC_KEY || '', 'base64'),
            },
        },
        access_token: {
            user: process.env.JWT_SECRET_KEY,
        },
    };
};
