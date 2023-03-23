import { Body, Controller, Post } from '@nestjs/common';
import { TestDTO } from './pipe.dto';

@Controller('pipe')
export class PipeController {
    @Post('/test')
    createUserW1(@Body() test: TestDTO) {
        return test;
    }
}
