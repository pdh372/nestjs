import { Module } from '@nestjs/common';
import { AuthModule } from '@src/api/service/auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [AuthModule.register(), UserModule],
})
export class RouterModule {}