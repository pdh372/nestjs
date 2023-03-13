import { Module, Controller, Post, Body, Inject } from '@nestjs/common';
import { MyDynamicModule, MyDynamicService } from './dynamic.module';
import * as INJECT_TOKEN from '@constant/injectionToken.const';

@Controller('dynamic-module/game')
export class Game {
    constructor(
        @Inject(INJECT_TOKEN.IT_DYNAMIC_MODULE_FILENAME('game.sql')) private myDynamicService: MyDynamicService,
    ) {}

    @Post()
    createGame(@Body() body: any) {
        this.myDynamicService.writeData(body);
        return 'ok';
    }
}

@Module({ imports: [MyDynamicModule.forFeature('game.sql')], controllers: [Game] })
export class GameModule {}
