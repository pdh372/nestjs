import { InjectionToken } from '@nestjs/common';

// Encrypt
export const ENCRYPT: InjectionToken = Symbol('inject_token_encrypt_service');

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

// REDIS
export const REDIS = {
    WRITER: Symbol('writer'),
    // THROTTLER: Symbol('throttler'),
};
