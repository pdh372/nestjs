import { InjectionToken } from '@nestjs/common';

export interface ICreateRedisInstance {
    it: InjectionToken;
    url?: string;
    database?: number;
}

export interface IRedisModuleOption {
    configs: ICreateRedisInstance[];
}
