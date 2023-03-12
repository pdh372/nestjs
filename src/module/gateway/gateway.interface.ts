import { Provider } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { IConfigService } from '@interface/config.interface';

export interface IGatewayModuleOption {
    imports?: any[];
    providers: Provider[];
}

export interface IConnectRedisAdapter {
    redis: RedisClientType;
    configService: IConfigService;
}
