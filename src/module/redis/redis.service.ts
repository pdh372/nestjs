import { ICreateRedisInstance } from '@module/redis/redis.interface';
import { appColor, warnColor } from '@helper/chalk.helper';
import * as redis from 'redis';
import { InjectionToken, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import * as IT from '@constant/injection-token.const';

const _connection = new Map<InjectionToken, redis.RedisClientType>();

export const newRedisClient = async (config: ICreateRedisInstance) => {
    try {
        let client = _connection.get(config.it);
        if (client) return client;

        client = redis.createClient({
            url: config.url,
            database: config.database,
        });

        await client.connect();
        _connection.set(config.it, client);
        appColor(`🍺 Connected redis token = "${config.it.toString()}"`);
        return client;
    } catch (error) {
        warnColor('newRedisClient: ', error.message);
    }
};

export class RedisWriter {
    constructor(@Inject(IT.REDIS.WRITER) private writer: RedisClientType) {}

    get client() {
        return this.writer;
    }
}

export class RedisAdapter {
    constructor(@Inject(IT.REDIS.ADAPTER) private adapter: RedisClientType) {}

    get client() {
        return this.adapter;
    }
}
