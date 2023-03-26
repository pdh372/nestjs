import { Module } from '@nestjs/common';
import { LocalStrategy } from '@src/service/strategy/local.strategy';

@Module({
    providers: [LocalStrategy],
    exports: [LocalStrategy],
})
export class MyPassportStrategyModule {}
