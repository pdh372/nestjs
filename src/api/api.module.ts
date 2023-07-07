import { Module } from '@nestjs/common';
import { ServiceModule } from '@service/service.module';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
    imports: [ServiceModule.register(), UserModule, DashboardModule],
})
export class ApiModule {}
