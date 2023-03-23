import { InterceptorController } from '@src/api/controller/template/6_interceptor/interceptor.controller';
import { Module } from '@nestjs/common';

@Module({
    controllers: [InterceptorController],
})
export class InterceptorModule {}
