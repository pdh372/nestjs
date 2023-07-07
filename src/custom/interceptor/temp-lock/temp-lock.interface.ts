import { TEMP_LOCK_TYPE } from './temp-lock.const';
export interface ITempLockMetadata {
    lockType: ConstValue<typeof TEMP_LOCK_TYPE>;
    maxAttempt?: number;
    lockTime?: number; // in minute
}
