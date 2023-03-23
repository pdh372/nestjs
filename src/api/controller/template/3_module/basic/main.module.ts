import { Controller, Get, Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { DogModule, DogService } from './dog.module';

@Controller('module/main')
class MainController {
    constructor(private dogService: DogService) {}

    @Get()
    getData() {
        return this.dogService.findAll();
    }
}

@Module({
    imports: [UserModule, DogModule],
    controllers: [MainController],
})
export class MainModule {}
