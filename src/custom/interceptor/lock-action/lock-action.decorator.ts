import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ILockActionMetadata } from './lock-action.interface';
import { LOCK_ACTION_KEY } from './lock-action.const';
import { LockActionInterceptor } from '@interceptor/lock-action/lock-action.interceptor';

export function LockAction(params: ILockActionMetadata) {
    return applyDecorators(SetMetadata(LOCK_ACTION_KEY, params), UseInterceptors(LockActionInterceptor));
}
