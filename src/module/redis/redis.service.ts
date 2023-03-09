import { ICreateNewInstance } from '@module/redis/redis.interface';
import { Inject, Injectable } from '@nestjs/common';
import { errColor } from '@helper/chalk.helper';
import * as redis from 'redis';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@interface/config.interface';

@Injectable()
export class RedisService {
    private _connection = new Map();

    constructor(@Inject(ConfigService) private configService: IConfigService) {}

    async newRedisClient(config: ICreateNewInstance) {
        try {
            const client = redis.createClient({
                url: this.configService.get('redis_url'),
                database: this.configService.get('redis_database'),
            });

            if (this._connection.get(config.inject_token)) {
                throw new Error(`Duplicate Inject_Token Redis = ${config.inject_token}`);
            }

            await client.connect();
            this._connection.set(config.inject_token, client);
            console.log(`connected redis token = ${config.inject_token}`);
            return client;
        } catch (error) {
            errColor(error.message);
        }
    }

    getRedisClient(token: string) {
        return this._connection.get(token);
    }
}
