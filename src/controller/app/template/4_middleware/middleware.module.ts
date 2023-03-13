import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MiddlewareController } from '@src/controller/app/template/4_middleware/middleware.controller';
// import * as useragent from 'express-useragent';
@Module({
    controllers: [MiddlewareController],
})
export class MiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer;
        // consumer.apply(useragent.express()).forRoutes(MiddlewareController);
    }
}
