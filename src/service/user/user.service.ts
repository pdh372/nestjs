import { MongodbService } from 'src/model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly models: MongodbService) {}
}
