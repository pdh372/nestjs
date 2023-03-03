import { Controller, Get, Module, Injectable } from '@nestjs/common';

@Injectable({})
export class DogService {
    private _database = [
        { _id: '1', name: 'a', type: 'corgi' },
        { _id: '2', name: 'b', type: 'corgi' },
    ];
    private _count = 0;

    @Get()
    findAll() {
        return {
            data: this._database,
            count: ++this._count,
        };
    }

    @Get()
    findById(id: string) {
        return {
            dog: this._database.find(dog => dog._id === id),
            count: ++this._count,
        };
    }
}

@Controller('module/dog')
class DogController {
    constructor(private dogService: DogService) {}

    @Get()
    getDogList() {
        return this.dogService.findAll();
    }
}

@Module({
    controllers: [DogController],
    providers: [DogService],
    exports: [DogService],
})
export class DogModule {}
