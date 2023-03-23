import { HttpModule, HttpService } from '@nestjs/axios';
import { Controller, Get, Module, Injectable, Post } from '@nestjs/common';
import { createHmac } from 'crypto';
import { lastValueFrom } from 'rxjs';

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
    constructor(private dogService: DogService, private httpService: HttpService) {}

    @Get()
    getDogList() {
        return this.dogService.findAll();
    }

    @Post('sign-up')
    async signUp() {
        const func = async () => {
            const now = Date.now();
            const method = 'post' as const;
            const path = '/sign-up';

            const stringToSign = `${method.toUpperCase()}
application/json
${now}
${path}
`;
            const response = this.httpService[method](
                'https://staging.magnumbe.sqkii.com/api/v1' + path,
                {
                    username: 'classic',
                    password: 'Sqkii@123',
                    secret_questions: [
                        { q: '1', a: '1' },
                        { q: '2', a: '1' },
                    ],
                },
                {
                    headers: {
                        ctime: Date.now(),
                        sig: createHmac('sha256', 'H6ilk9SZpkx8DYNJ').update(stringToSign).digest('base64'),
                    },
                },
            );
            const body = await lastValueFrom(response);
            return body.data.data;
        };
        try {
            let promises = [];
            for (let i = 1; i <= 5; i++) {
                promises.push(func());
                await sleep();
            }
            promises = await Promise.all(promises);
            return promises;
        } catch (error) {
            console.info(error.message);
            return [];
        }
    }
}

const sleep = () => {
    console.info('sleeping...');
    return new Promise(resolve => setTimeout(resolve, 2000));
};

@Module({
    imports: [HttpModule],
    controllers: [DogController],
    providers: [DogService],
    exports: [DogService],
})
export class DogModule {}
