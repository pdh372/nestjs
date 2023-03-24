export interface ILockActionMetadata {
    lockType: TLockActionType;
    lockTime?: number; // in second
}

export type TLockActionType = 'signup' | 'login';
export type TLockActionTypeObj = MappedTypeConst<TLockActionType>;
