import { AuthGuard } from '@nestjs/passport';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { STRATEGY_PASSPORT_TYPE } from '@module/strategy-passport/strategy-passport.const';

class LocalGuard extends AuthGuard(STRATEGY_PASSPORT_TYPE.LOCAL) {}

export function LocalPassport() {
    return applyDecorators(UseGuards(LocalGuard));
}
