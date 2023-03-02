/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '@repository/model/user.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RepositoryService {
    // @ts-ignore
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    get User() {
        return this.userModel;
    }
}
