import { Body, Controller, Get, Post } from '@nestjs/common';

import { ModelService } from '@repository/mongodb/mongodb.service';
import { RedisClientType } from 'redis';
import { InjectRedisInstance } from 'src/module/redis/redis.helper';

@Controller({ path: 'user' })
export class UserController {
    constructor(
        private readonly repositories: ModelService,
        @InjectRedisInstance('first') private readonly redis: RedisClientType,
    ) {}

    @Get()
    async getListUser() {
        const users = await this.repositories.User.find().lean();
        await this.redis.incr('huy');
        return { users, huy: await this.redis.get('huy') };
    }

    @Post()
    createUser(@Body() body: any) {
        return this.repositories.User.create(body);
    }
}
