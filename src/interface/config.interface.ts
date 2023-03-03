export type INodeENV = 'development' | 'production' | 'staging' | 'pentest';

export interface IAppConfig {
    node_env: INodeENV;
    port: number;
    mongodb_url: string;
    debug_mongoose_transaction: boolean;
    debug_mongoose_model: boolean;
    debug_global_pipe: boolean;
    debug_global_interceptor: boolean;
}
