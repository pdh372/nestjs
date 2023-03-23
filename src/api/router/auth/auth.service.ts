import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { Types } from 'mongoose';
import * as IT from '@src/constant/injection-token.const';
import { IUserVerified } from '@src/api/router/auth/auth.interface';

export class AuthService {
    constructor(
        private readonly models: MongodbService,
        @Inject(IT.JWT.USER.ACCESS_TOKEN) private readonly userAccessToken: JwtService,
        @Inject(IT.JWT.USER.REFRESH_TOKEN) private readonly userRefreshToken: JwtService,
    ) {}

    signUserToken(params: { _id: string | Types.ObjectId }) {
        return {
            accessToken: this.userAccessToken.sign({ _id: params._id }),
            refreshToken: this.userRefreshToken.sign({ _id: params._id }),
        };
    }

    verifyUserRefreshToken(params: { refreshToken: string }) {
        try {
            const data = this.userRefreshToken.verify<IUserVerified>(params.refreshToken);
            return data;
        } catch (error) {
            return error.message;
        }
    }

    verifyUserAccessToken(params: { accessToken: string }) {
        try {
            const data = this.userAccessToken.verify<IUserVerified>(params.accessToken);
            return data;
        } catch (error) {
            return null;
        }
    }

    signUserAccessToken(params: { _id: string | Types.ObjectId }) {
        return {
            accessToken: this.userAccessToken.sign({ _id: params._id }),
        };
    }
}
