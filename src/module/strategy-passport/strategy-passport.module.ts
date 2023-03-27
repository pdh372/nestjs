import { Module } from '@nestjs/common';
import { LocalStrategy } from './local/local.strategy';

@Module({
    providers: [LocalStrategy],
    exports: [LocalStrategy],
})
export class StrategyPassportModule {}
