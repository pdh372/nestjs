import { Controller, Get, Req, Session } from '@nestjs/common';
import { IAppReq } from '@interface/express.interface';
import { Request } from 'express';

@Controller('middleware')
export class MiddlewareController {
    @Get('useragent')
    getUserAgent(@Req() req: IAppReq) {
        return {
            default: req.headers,
            lib: req.useragent,
        };
    }

    @Get('session')
    testSession(@Session() session: any, @Req() req: Request) {
        // session.temp = session.temp ? session.temp + 1 : 1;
        return { session, _id: req.sessionID, cok: req.cookies, temp: req.session, ip: req.ip };
    }
}
