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
import { ERROR_AUTH } from '@constant/error.const';
import { tempLockHelper } from '@helper/temp-lock.helper';

@Injectable()
export class TempLockInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        let req = context.switchToHttp().getRequest<IAppReq>();

        const reflector = this.reflector.get<ITempLockMetadata>(TEMP_LOCK_KEY, context.getHandler());
        if (!reflector) throw new InternalServerErrorException();

        const { lockType, maxAttempt, lockTime } = reflector;
        const isTempLocked = tempLockHelper({ req, data: { lockType, maxAttempt, lockTime } });

        if (isTempLocked.error) {
            throw new HttpException(
                {
                    info: ERROR_AUTH.TEMP_LOCKED,
                    lockedUntil: req.session[req.lockedUntilKey],
                    failed: req.maxAttempt,
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        req = isTempLocked.req;

        return next.handle();
    }
}
