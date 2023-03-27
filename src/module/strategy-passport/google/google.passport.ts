import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { STRATEGY_PASSPORT_TYPE } from '@module/strategy-passport/strategy-passport.const';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { IProfileJsonGoogle } from './google.interface';
import { SIGN_UP_TYPE } from '@constant/business.const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, STRATEGY_PASSPORT_TYPE.GOOGLE) {
    constructor(private models: MongodbService, @Inject(ConfigService) configService: IConfigService) {
        super({
            clientID: configService.get('passport.google.client_id'),
            clientSecret: configService.get('passport.google.client_secret'),
            callbackURL: configService.get('passport.google.cb_url'),
            scope: ['profile', 'email'],
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any) {
        const data: IProfileJsonGoogle = {
            accessToken,
            sub: profile._json.sub,
            name: profile._json.name,
            picture: profile._json.picture,
            emailVerified: profile._json.email_verified,
            locale: profile._json.locale,
        };

        const user = this.models.User.findOneAndUpdate(
            { account: profile._json.email },
            { signupType: SIGN_UP_TYPE.GOOGLE, 'secretMetadata.google': data },
            { upsert: true, new: true },
        ).lean();

        return user;
    }
}
