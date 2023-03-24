import { SetMetadata } from '@nestjs/common';
import { ITempLockMetadata } from './temp-lock.interface';
import { TEMP_LOCK_KEY } from './temp-lock.const';

export const TempLockMetadata = (params: ITempLockMetadata) => SetMetadata(TEMP_LOCK_KEY, params);
