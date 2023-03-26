import {
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Inject,
    NestInterceptor,
    CallHandler,
    InternalServerErrorException,
} from '@nestjs/common';
import { ERROR_COMMON } from '@constant/error.const';
import { RedisWriter } from 'src/module/redis/redis.service';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ILockActionMetadata } from './lock-action.interface';
import { LOCK_ACTION_KEY } from './lock-action.const';
import { tap, catchError, throwError } from 'rxjs';

@Injectable()
export class LockActionInterceptor implements NestInterceptor {
    constructor(
        private redisWriter: RedisWriter,
        @Inject(ConfigService) private configService: IConfigService,
        private reflector: Reflector,
    ) {}
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const req = context.switchToHttp().getRequest<IAppReq>();

        const data = this.reflector.get<ILockActionMetadata>(LOCK_ACTION_KEY, context.getHandler());
        if (!data) throw new InternalServerErrorException();

        const { lockType, lockTime } = data;
        const key = `${this.configService.get('app_name')}_LA_${lockType}_${req.user?._id.toString() || req.sessionID}`;
        const count = await this.redisWriter.client.incr(key);

        if (!req.keys) req.keys = [];
        req.keys.push(key);

        if (count > 1) {
            throw new HttpException(
                {
                    info: ERROR_COMMON.TMR,
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        await this.redisWriter.client.expire(key, lockTime || 30);

        return next.handle().pipe(
            tap(() => {
                // delete key redis after handler response
                req.keys && this.redisWriter.client.del(req.keys);
            }),
            catchError(err => {
                req.keys && this.redisWriter.client.del(req.keys);
                return throwError(() => err);
            }),
        );
    }
}
