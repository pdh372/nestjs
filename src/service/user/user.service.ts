import { MongodbService } from '@module/mongodb/mongodb.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly models: MongodbService) {}
}
