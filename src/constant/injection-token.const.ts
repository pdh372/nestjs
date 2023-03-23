import { InjectionToken } from '@nestjs/common';

// provider.module.ts
export const IT_LEARN_USE_VALUE: InjectionToken = Symbol('key_of_use_value_1');
export const IT_LEARN_USE_CLASS: InjectionToken = Symbol('key_of_use_class');
export const IT_LEARN_USE_FUNC: InjectionToken = Symbol('key_of_use_function');

// My Dynamic Module
export const IT_DYNAMIC_MODULE_INPUT: InjectionToken = Symbol('dynamic_module_dirname');
export const IT_DYNAMIC_MODULE_FILENAME = (filename: string): InjectionToken => {
    return 'dynamic_module_filename' + filename;
};

// Encrypt
export const ENCRYPT: InjectionToken = Symbol('inject_token_encryptService');

// REDIS
type TITRedis = 'WRITER' | 'READER' | 'ADAPTER' | 'THROTTLER';
export const REDIS: Record<TITRedis, InjectionToken> = {
    WRITER: Symbol('writer'),
    READER: Symbol('reader'),
    ADAPTER: Symbol('adapter'),
    THROTTLER: Symbol('throttler'),
};

// JWT
export const JWT = {
    USER: {
        ACCESS_TOKEN: Symbol('user_access_token'),
        REFRESH_TOKEN: Symbol('user_refresh_token'),
    },
    ADMIN: {
        ACCESS_TOKEN: Symbol('admin_access_token'),
        REFRESH_TOKEN: Symbol('admin_refresh_token'),
    },
};
