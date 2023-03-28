import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { STRATEGY_PASSPORT_TYPE } from '@module/strategy-passport/strategy-passport.const';
import { IProfileJson } from '@module/strategy-passport/strategy-passport.interface';
import { SIGN_UP_TYPE } from '@constant/business.const';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@service/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, STRATEGY_PASSPORT_TYPE.GOOGLE) {
    constructor(private userService: UserService, @Inject(ConfigService) configService: IConfigService) {
        super({
            clientID: configService.get('passport.google.client_id'),
            clientSecret: configService.get('passport.google.client_secret'),
            callbackURL: configService.get('passport.cb') + 'user/public/login-google-cb',
            scope: ['profile', 'email'],
        });
    }
    async validate(accessToken: string, _: string, profile: any) {
        const data: IProfileJson = {
            accessToken,
            ppid: profile._json.sub,
            name: profile._json.name,
            avt_url: profile._json.picture,
        };

        return await this.userService.loginWithPassport({
            account: profile._json.email,
            signupType: SIGN_UP_TYPE.GOOGLE,
            data,
        });
    }
}
