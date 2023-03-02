import { Module } from '@nestjs/common';
import { InterceptorModule } from './3_interceptor/interceptor.module';
import { ProviderModule } from './2_provider/provider.module';
import { ControllerModule } from './1_controller/ctl.module';

@Module({
    imports: [ControllerModule, ProviderModule, InterceptorModule],
})
export class TemplateModule {}
