import { SetMetadata } from '@nestjs/common';
import { ILockActionMetadata } from './lock-action.interface';
import { LOCK_ACTION_KEY } from './lock-action.const';

export const LockActionMetadata = (params: ILockActionMetadata) => SetMetadata(LOCK_ACTION_KEY, params);
