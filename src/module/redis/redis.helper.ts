import { Inject, InjectionToken } from '@nestjs/common';

export const hashToken = (token: InjectionToken) => {
    return '5313254_' + token.toString() + '321362178';
};

export function InjectRedisInstance(token: InjectionToken) {
    return (target: any, key: undefined, index: number): any => {
        Inject(hashToken(token))(target, key, index);
    };
}
