import { PipeController } from './pipe.controller';
import { Module } from '@nestjs/common';

@Module({
    controllers: [PipeController],
})
export class PipeModule {}
