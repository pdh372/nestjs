import { LOCK_ACTION_TYPE } from './lock-action.const';
export interface ILockActionMetadata {
    lockType: ConstValue<typeof LOCK_ACTION_TYPE>;
    lockTime?: number; // in second
}
