export interface ITempLockMetadata {
    lockType: TTempLockType;
    maxAttempt?: number;
    lockTime?: number; // in minute
}

export type TTempLockType = 'signup' | 'login' | 'refresh_token';
export type TTempLockTypeObj = MappedTypeConst<TTempLockType>;
