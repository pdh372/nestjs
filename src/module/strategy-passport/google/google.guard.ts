import { AuthGuard } from '@nestjs/passport';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { STRATEGY_PASSPORT_TYPE } from '@module/strategy-passport/strategy-passport.const';

class GoogleGuard extends AuthGuard(STRATEGY_PASSPORT_TYPE.GOOGLE) {}

export function GooglePassport() {
    return applyDecorators(UseGuards(GoogleGuard));
}
