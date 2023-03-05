import { Controller, Get, Req } from '@nestjs/common';
import { IAppReq } from '@interface/express.interface';

@Controller('middleware')
export class MiddlewareController {
    @Get()
    getUserAgent(@Req() req: IAppReq) {
        return {
            default: req.headers,
            lib: req.useragent,
        };
    }
}
