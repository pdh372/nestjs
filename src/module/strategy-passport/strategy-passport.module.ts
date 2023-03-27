import { Module } from '@nestjs/common';
import { LocalStrategy } from './local/local.passport';
import { GoogleStrategy } from './google/google.passport';
import { GithubStrategy } from './github/github.passport';

@Module({
    providers: [LocalStrategy, GoogleStrategy, GithubStrategy],
    exports: [LocalStrategy, GoogleStrategy, GithubStrategy],
})
export class StrategyPassportModule {}
