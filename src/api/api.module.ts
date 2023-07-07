import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ServiceModule } from '@service/service.module';

@Module({
    imports: [ServiceModule.register(), UserModule],
})
export class ApiModule {}
