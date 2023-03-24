import { Provider } from '@nestjs/common';
import { RedisClientType } from 'redis';

export interface IGatewayModuleOption {
    imports?: any[];
    providers: Provider[];
}

export interface IConnectRedisAdapter {
    redis: RedisClientType;
    configService: IConfigService;
}
