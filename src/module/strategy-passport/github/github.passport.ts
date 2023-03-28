import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { STRATEGY_PASSPORT_TYPE } from '@module/strategy-passport/strategy-passport.const';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { SIGN_UP_TYPE } from '@constant/business.const';
import { ConfigService } from '@nestjs/config';
import { IProfileJson } from '@module/strategy-passport/strategy-passport.interface';
import { UserService } from '@service/user/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, STRATEGY_PASSPORT_TYPE.GITHUB) {
    constructor(@Inject(ConfigService) configService: IConfigService, private userService: UserService) {
        super({
            clientID: configService.get('passport.github.client_id'),
            clientSecret: configService.get('passport.github.client_secret'),
            callbackURL: configService.get('passport.cb') + 'user/public/login-github-cb',
            scope: ['user:email'],
        });
    }

    async validate(accessToken: string, _: string, profile: any) {
        const data: IProfileJson = {
            accessToken,
            ppid: profile._json.id,
            name: profile._json.name,
            avt_url: profile._json.avatar_url,
        };

        return await this.userService.loginWithPassport({
            account: profile._json.email,
            signupType: SIGN_UP_TYPE.GITHUB,
            data,
        });
    }
}
