import { Module } from '@nestjs/common';
import { LocalStrategy } from './local/local.passport';
import { GoogleStrategy } from './google/google.passport';

@Module({
    providers: [LocalStrategy, GoogleStrategy],
    exports: [LocalStrategy, GoogleStrategy],
})
export class StrategyPassportModule {}
