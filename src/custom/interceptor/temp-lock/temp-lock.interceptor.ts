import {
    ExecutionContext,
    Injectable,
    NestInterceptor,
    CallHandler,
    InternalServerErrorException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ITempLockMetadata } from './temp-lock.interface';
import { TEMP_LOCK_KEY } from './temp-lock.const';
import * as moment from 'moment';
import { ERROR_AUTH } from '@constant/error.const';

@Injectable()
export class TempLockInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        const req = context.switchToHttp().getRequest<IAppReq>();

        const data = this.reflector.get<ITempLockMetadata>(TEMP_LOCK_KEY, context.getHandler());
        if (!data) throw new InternalServerErrorException();

        const { lockType, maxAttempt = 5, lockTime = 5 } = data;

        req.attemptsKey = `${lockType}_attempts`;
        req.lockedUntilKey = `${lockType}_locked_until`;
        req.maxAttempt = maxAttempt;
        req.lockTime = lockTime;

        if (req.session[req.lockedUntilKey] > new Date()) {
            throw new HttpException(
                {
                    info: ERROR_AUTH.TEMP_LOCKED,
                    lockedUntil: req.session[req.lockedUntilKey],
                    failed: maxAttempt,
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        req.session[req.attemptsKey] = (+req.session[req.attemptsKey] || 0) + 1;
        if (req.session[req.attemptsKey] > maxAttempt) {
            req.session[req.lockedUntilKey] = moment().add(lockTime, 'minutes').toDate();
            req.session[req.attemptsKey] = 0;

            throw new HttpException(
                {
                    info: ERROR_AUTH.TEMP_LOCKED,
                    lockedUntil: req.session[req.lockedUntilKey],
                    failed: maxAttempt,
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        req.session[req.lockedUntilKey] = undefined;
        return next.handle();
    }
}
