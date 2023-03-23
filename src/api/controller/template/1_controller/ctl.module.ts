import { Module } from '@nestjs/common';
import { CtlController } from '@src/api/controller/template/1_controller/ctl.controller';

@Module({
    controllers: [CtlController],
})
export class ControllerModule {}