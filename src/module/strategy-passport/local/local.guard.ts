import { AuthGuard } from '@nestjs/passport';
import { UseGuards, applyDecorators } from '@nestjs/common';

class LocalGuard extends AuthGuard('local') {}

export function LocalPassport() {
    return applyDecorators(UseGuards(LocalGuard));
}
