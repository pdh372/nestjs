import { Body, Controller, Get, Post } from '@nestjs/common';

import { RepositoryService } from '@repository/repository.service';

@Controller({ path: 'user' })
export class UserController {
    constructor(private readonly repositories: RepositoryService) {}

    @Get()
    async getListUser() {
        const users = await this.repositories.User.find().lean();
        users.map(u => u.createdAt);
        return users;
    }

    @Post()
    createUser(@Body() body: any) {
        return this.repositories.User.create(body);
    }
}
