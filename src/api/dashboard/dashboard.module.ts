import { Module } from '@nestjs/common';
import { DashboardProductController } from './controller/dashboard.product.controller';

@Module({
    controllers: [DashboardProductController],
})
export class DashboardModule {}
