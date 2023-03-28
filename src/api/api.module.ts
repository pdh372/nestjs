import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ServiceModule } from '@service/service.module';
import { StrategyPassportModule } from '@module/strategy-passport/strategy-passport.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [PassportModule, StrategyPassportModule, ServiceModule.register(), UserModule],
})
export class ApiModule {}
