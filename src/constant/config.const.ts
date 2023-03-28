import { LogLevel } from '@nestjs/common';

type INodeENV = 'development' | 'production' | 'staging' | 'pentest';

interface IAppConfig {
    app_name?: string;
    node_env?: INodeENV;
    port?: number;
    cors_origins?: string;

    debug_mongoose_transaction?: boolean;
    debug_mongoose_model?: boolean;
    debug_global_request_data?: boolean;
    debug_global_interceptor?: boolean;

    mongodb_url?: string;

    cipher_key?: string;
    cipher_iv?: string;

    useragent?: boolean;
    compression?: boolean;
    session_secret?: string;
    session_name?: string;
    session_cookie_max_age?: number;
    session_store_expire?: number;

    redis_url?: string;
    redis_database?: number;

    refresh_token: {
        user?: {
            private_key?: Buffer;
            public_key?: Buffer;
        };
    };
    access_token: {
        user?: string;
    };

    passport: {
        response_fe?: string;
        cb?: string;
        google: {
            client_id?: string;
            client_secret?: string;
        };
        github: {
            client_id?: string;
            client_secret?: string;
        };
    };
}

export const APP_DATA_CONFIG = (): IAppConfig => {
    return {
        app_name: process.env.APP_NAME,
        node_env: process.env.NODE_ENV as INodeENV,
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

        passport: {
            response_fe: process.env.PASSPORT_FE_URL,
            cb: process.env.PASSPORT_BE_CB,
            google: {
                client_id: process.env.PASSPORT_GOOGLE_CLIENT_ID,
                client_secret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
            },
            github: {
                client_id: process.env.PASSPORT_GITHUB_CLIENT_ID,
                client_secret: process.env.PASSPORT_GITHUB_CLIENT_SECRET,
            },
        },
    };
};

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
