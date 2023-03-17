import { Module } from '@nestjs/common';
import { ControllerModule } from './1_controller/ctl.module';
import { ProviderModule } from './2_provider/provider.module';
import { InterceptorModule } from './6_interceptor/interceptor.module';
import { MiddlewareModule } from './4_middleware/middleware.module';
import { PipeModule } from './5_pipe/pipe.module';

@Module({
    imports: [ControllerModule, ProviderModule, MiddlewareModule, PipeModule, InterceptorModule],
})
export class TemplateModule {}
