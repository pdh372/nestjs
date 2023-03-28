import { MongodbService } from '@repository/mongodb/mongodb.service';
import { User } from '@repository/mongodb/model/user.model';
import { IProfileJson } from '@module/strategy-passport/strategy-passport.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly models: MongodbService) {}

    async loginWithPassport(param: { account: string; data: IProfileJson; signupType: string }): Promise<User> {
        const { account, signupType, data } = param;

        let user = await this.models.User.findOne({ account }, 'signupType');

        if (!user) {
            user = await this.models.User.create({ account, signupType, 'secretMetadata.passport': data });
        }

        return user;
    }
}
