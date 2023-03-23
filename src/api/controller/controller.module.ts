import { Module } from '@nestjs/common';
import { TemplateModule } from '@src/api/controller/template/template.module';
import { AuthModule } from '@controller/auth/auth.module';

@Module({
    imports: [AuthModule.register(), TemplateModule],
})
export class ControllerModule {}
