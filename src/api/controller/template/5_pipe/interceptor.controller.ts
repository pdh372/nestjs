import { Body, Controller, Get, Post } from '@nestjs/common';
import { fakeBasicData } from '@helper/fakeData.helper';

@Controller('interceptor')
export class InterceptorController {
    private _database = fakeBasicData();

    @Get('/users-w1')
    getUsersW1() {
        // Inject @Res() must use res to response back
        // throw new NotFoundException('User not found');
        return this._database.users;
    }

    @Post('/users-w1')
    createUserW1(@Body() body: any) {
        this._database.users.push(body);
        return body;
    }
}
