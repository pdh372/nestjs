import { ICreateRedisInstance } from '@module/redis/redis.interface';
import { appColor, errColor } from '@helper/chalk.helper';
import * as redis from 'redis';
import { InjectionToken } from '@nestjs/common';

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
        errColor('newRedisClient: ', error.message);
    }
};
