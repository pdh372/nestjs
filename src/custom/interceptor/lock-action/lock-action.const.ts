import { TLockActionTypeObj } from './lock-action.interface';

export const LOCK_ACTION_KEY = Symbol('lock_action');

export const LA_TYPE: TLockActionTypeObj = {
    SIGNUP: 'signup',
    LOGIN: 'login',
};
