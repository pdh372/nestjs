import {
    ExecutionContext,
    Injectable,
    HttpException,
    HttpStatus,
    NestInterceptor,
    CallHandler,
    InternalServerErrorException,
} from '@nestjs/common';
import { IAppReq } from '@interface/express.interface';
import { Reflector } from '@nestjs/core';
import { ITempLockMetadata } from './temp-lock.interface';
import { TEMP_LOCK_KEY } from './temp-lock.const';
import { TEMP_LOCKED } from 'src/constant/error.const';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Injectable()
export class TempLockInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest<IAppReq>();

        const data = this.reflector.get<ITempLockMetadata>(TEMP_LOCK_KEY, context.getHandler());
        if (!data) throw new InternalServerErrorException();

        const { lockType, maxAttempt = 5, lockTime = 5 } = data;
        req.attemptsKey = `${lockType}_attempts`;
        req.lockedUntilKey = `${lockType}_locked_until`;

        if (req.session[req.lockedUntilKey] > new Date()) {
            throw new HttpException(
                {
                    info: TEMP_LOCKED,
                    lockedUntil: req.session[req.lockedUntilKey],
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
                    info: TEMP_LOCKED,
                    lockedUntil: req.session[req.lockedUntilKey],
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        req.session[req.lockedUntilKey] = undefined;
        req.maxAttempt = maxAttempt;
        req.lockTime = lockTime;
        req.session[lockType] = (req.session[lockType] || 0) + 1;

        return next.handle();
    }
}
