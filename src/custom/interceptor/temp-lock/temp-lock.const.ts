import { TTempLockTypeObj } from './temp-lock.interface';
export const TEMP_LOCK_KEY = Symbol('temp_lock_key');

export const TL_TYPE: TTempLockTypeObj = {
    SIGNUP: 'signup',
    LOGIN: 'login',
};
