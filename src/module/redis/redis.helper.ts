import { Inject } from '@nestjs/common';

export const hashToken = (token: string) => {
    return '5313254_' + token.toString() + '321362178';
};

export function InjectRedisInstance(token: string) {
    return (target: any, key: undefined, index: number): any => {
        Inject(hashToken(token))(target, key, index);
    };
}
