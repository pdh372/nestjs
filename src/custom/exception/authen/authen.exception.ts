import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { ERROR_AUTH } from '@constant/error.const';
import * as moment from 'moment';
@Catch(BadRequestException)
export class AuthenException implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    async catch(exception: BadRequestException, host: ArgumentsHost): Promise<void> {
        const { httpAdapter } = this.httpAdapterHost;
        const res = host.switchToHttp().getResponse<Response>();
        const req = host.switchToHttp().getRequest<IAppReq>();
        const httpCode = exception.getStatus();

        let lockedUntil = req.session[req.lockedUntilKey];
        const failed = req.session[req.attemptsKey];

        if (failed >= req.maxAttempt) {
            lockedUntil = moment().add(req.lockTime, 'minutes').toDate();
        }

        const responsePayload = {
            statusCode: httpCode,
            body: {
                info: lockedUntil ? ERROR_AUTH.TEMP_LOCKED : ERROR_AUTH.BAD_REQUEST,
                lockedUntil,
                failed,
            },
        };

        httpAdapter.reply(res, responsePayload, httpCode);
    }
}
