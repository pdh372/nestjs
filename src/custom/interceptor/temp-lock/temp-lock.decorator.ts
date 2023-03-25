import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ITempLockMetadata } from './temp-lock.interface';
import { TEMP_LOCK_KEY } from './temp-lock.const';
import { TempLockInterceptor } from '@interceptor/temp-lock/temp-lock.interceptor';

export function TempLock(params: ITempLockMetadata) {
    return applyDecorators(SetMetadata(TEMP_LOCK_KEY, params), UseInterceptors(TempLockInterceptor));
}
