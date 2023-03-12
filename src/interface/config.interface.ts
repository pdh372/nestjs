import { ConfigService } from '@nestjs/config';

export type INodeENV = 'development' | 'production' | 'staging' | 'pentest';

export interface IAppConfig {
    app_name?: string;
    node_env?: INodeENV;
    port?: number;
    cors_origins?: string;

    debug_mongoose_transaction?: boolean;
    debug_mongoose_model?: boolean;
    debug_global_pipe?: boolean;
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
}

export type IConfigService = ConfigService<IAppConfig>;
