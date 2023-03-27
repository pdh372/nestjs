import { AuthGuard } from '@nestjs/passport';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { STRATEGY_PASSPORT_TYPE } from '@module/strategy-passport/strategy-passport.const';

class GithubGuard extends AuthGuard(STRATEGY_PASSPORT_TYPE.GITHUB) {}

export function GithubPassport() {
    return applyDecorators(UseGuards(GithubGuard));
}
