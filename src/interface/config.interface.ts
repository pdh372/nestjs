export type INodeENV = 'development' | 'production' | 'staging' | 'pentest';

export interface IAppConfig {
    node_env: INodeENV;
    port: number;
    mongodb_url: string;
    mongoose_debug: boolean;
}
