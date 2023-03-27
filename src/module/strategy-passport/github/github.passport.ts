import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { STRATEGY_PASSPORT_TYPE } from '@module/strategy-passport/strategy-passport.const';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { SIGN_UP_TYPE } from '@constant/business.const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, STRATEGY_PASSPORT_TYPE.GITHUB) {
    constructor(private models: MongodbService, @Inject(ConfigService) configService: IConfigService) {
        super({
            clientID: 'd82276bd9fc4de1d5d74',
            clientSecret: 'ef1f34bd99c3b2e2209531bce80e069d9859b45d',
            callbackURL: 'http://localhost:3001/user/public/login-github-cb',
            scope: ['user:email'],
        });
    }
    async validate(accessToken: string, _: string, profile: any) {
        console.log(accessToken, profile._json);

        // const user = this.models.User.findOneAndUpdate(
        //     { account: profile._json.email },
        //     { signupType: SIGN_UP_TYPE.GOOGLE, 'secretMetadata.google': data },
        //     { upsert: true, new: true },
        // ).lean();

        return '123';
    }
}
