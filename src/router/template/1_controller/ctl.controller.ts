import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { fakeBasicData } from '@helper/fakeData';
import { Response } from 'express';

@Controller({ path: 'ctl' })
export class CtlController {
    private _database = fakeBasicData();

    @Get('users-w1')
    getUsersW1(@Res({ passthrough: true }) res: Response) {
        // Inject @Res() must use res to response back
        res.status(HttpStatus.OK);
        return this._database.users;
    }

    @Get('users-w2')
    // @HttpCode(HttpStatus.OK)
    getUsersW2() {
        return this._database.users;
    }

    @Post('users-w1')
    createUserW1(@Res() res: Response, @Body() body: any) {
        // Inject @Res() must use res to response back
        this._database.users.push(body);

        return res.status(HttpStatus.CREATED).send(body);
    }

    @Post('users-w2')
    @HttpCode(HttpStatus.CREATED)
    createUserW2(@Body() body: any) {
        this._database.users.push(body);
        return body;
    }
}
