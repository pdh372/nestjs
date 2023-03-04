import { ConfigService } from '@nestjs/config';
export type INodeENV = 'development' | 'production' | 'staging' | 'pentest';

export interface IAppConfig {
    node_env: INodeENV;
    port: number;

    debug_mongoose_transaction: boolean;
    debug_mongoose_model: boolean;
    debug_global_pipe: boolean;
    debug_global_interceptor: boolean;

    mongodb_url: string;

    cipher_key: string;
    cipher_iv: string;
}

export type IConfigService = ConfigService<IAppConfig>;
