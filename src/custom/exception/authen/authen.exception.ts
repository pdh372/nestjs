import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { Response } from 'express';
import { ERROR_AUTH } from '@constant/error.const';
import * as moment from 'moment';

@Catch(BadRequestException)
export class AuthenException implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost, private readonly reflector: Reflector) {}

    async catch(exception: BadRequestException, host: ArgumentsHost): Promise<void> {
        const { httpAdapter } = this.httpAdapterHost;
        const res = host.switchToHttp().getResponse<Response>();
        const req = host.switchToHttp().getRequest<IAppReq>();

        const httpCode = exception.getStatus();

        const failed = req.session[req.attemptsKey] || req.maxAttempt;
        let lockedUntil = req.session[req.lockedUntilKey];

        if (failed >= req.maxAttempt) {
            lockedUntil = moment().add(5, 'minutes').toDate();
        }

        const responsePayload = {
            statusCode: httpCode,
            body: {
                info: lockedUntil ? ERROR_AUTH.TEMP_LOCKED : ERROR_AUTH.LOGIN_UNSUCCESSFULLY,
                lockedUntil,
                failed,
            },
        };

        httpAdapter.reply(res, responsePayload, httpCode);
    }
}
