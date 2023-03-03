import { Body, Controller, Get, Inject, Module, NotFoundException, Patch } from '@nestjs/common';
import { DogService, DogModule } from './dog.module';

interface IDog {
    dogs: string[];
    _id: string;
    name: string;
}

export class UserService {
    private _database: IDog[] = [
        { _id: 'user01', name: 'huy1', dogs: [] },
        { _id: 'user02', name: 'huy2', dogs: [] },
    ];

    constructor(@Inject(DogService) private dogService: DogService) {}

    buyDog(user_id: string, dog_id: string) {
        const user = this._database.find(u => u._id === user_id);
        const data = this.dogService.findById(dog_id);
        if (!user || !data.dog) return false;
        user.dogs.push(data.dog._id);
        return user.dogs;
    }

    findAll() {
        return {
            user: this._database,
            dog: this.dogService.findAll(),
        };
    }
}

@Controller('module/user')
class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    getListUser() {
        return this.userService.findAll();
    }

    @Patch('buy-dog')
    userBuyDog(@Body() body: any) {
        const dogs = this.userService.buyDog(body.user_id, body.dog_id);
        if (!dogs) {
            throw new NotFoundException('data_not_found');
        }
        return { dogs };
    }
}

@Module({
    imports: [DogModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
