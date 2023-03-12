import { DynamicModule, Global, Module } from '@nestjs/common';
import { hashToken } from '@module/redis/redis.helper';
import { ICreateRedisInstance, IRedisModuleOption } from './redis.interface';
import { newRedisClient } from './redis.service';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@interface/config.interface';

@Global()
@Module({})
export class RedisModule {
    static forRoot(createNewInstance: IRedisModuleOption): DynamicModule {
        const ITs = createNewInstance.configs.map(c => hashToken(c.it));

        return {
            module: RedisModule,
            providers: [
                ...ITs.map((token, index) => ({
                    provide: token,
                    useFactory: (configService: IConfigService) => {
                        const config = createNewInstance.configs[index];
                        const option: ICreateRedisInstance = {
                            it: config.it,
                            url: config.url || configService.get('redis_url'),
                            database: config.database || configService.get('redis_database'),
                        };
                        return newRedisClient(option);
                    },
                    inject: [ConfigService],
                })),
            ],
            exports: [...ITs],
        };
    }
}
