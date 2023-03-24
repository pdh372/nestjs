import { Inject, InjectionToken } from '@nestjs/common';

export function InjectRedisInstance(token: InjectionToken) {
    return (target: any, key: undefined, index: number): any => {
        Inject(token)(target, key, index);
    };
}
