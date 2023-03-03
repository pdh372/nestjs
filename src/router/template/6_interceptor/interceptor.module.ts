import { InterceptorController } from '@src/router/template/6_interceptor/interceptor.controller';
import { Module } from '@nestjs/common';

@Module({
    controllers: [InterceptorController],
})
export class InterceptorModule {}
