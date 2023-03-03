import { Body, Controller, Get, Post } from '@nestjs/common';

import { MongodbService } from '@repository/mongodb/mongodb.service';

@Controller({ path: 'user' })
export class UserController {
    constructor(private readonly repositories: MongodbService) {}

    @Get()
    async getListUser() {
        const users = await this.repositories.User.find().lean();

        return users;
    }

    @Post()
    createUser(@Body() body: any) {
        return this.repositories.User.create(body);
    }
}
