import { Module } from '@nestjs/common';
import { InterceptorModule } from './6_interceptor/interceptor.module';
import { ProviderModule } from './2_provider/provider.module';
import { ControllerModule } from './1_controller/ctl.module';
import { MiddlewareModule } from '@router/app/template/4_middleware/middleware.module';

@Module({
    imports: [ControllerModule, ProviderModule, MiddlewareModule, InterceptorModule],
})
export class TemplateModule {}
