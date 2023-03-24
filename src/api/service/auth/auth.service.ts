import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import * as IT from '@src/constant/injection-token.const';
import { IUserVerified } from '@src/api/service/auth/auth.interface';

export class AuthService {
    constructor(
        @Inject(IT.JWT.USER.ACCESS_TOKEN) private readonly userAccessToken: JwtService,
        @Inject(IT.JWT.USER.REFRESH_TOKEN) private readonly userRefreshToken: JwtService,
    ) {}

    signUserToken(params: { _id: string | Types.ObjectId }) {
        const data: IUserVerified = { _id: params._id.toString() };
        return {
            accessToken: this.userAccessToken.sign(data),
            refreshToken: this.userRefreshToken.sign(data),
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
        const data: IUserVerified = { _id: params._id.toString() };
        return {
            accessToken: this.userAccessToken.sign(data),
        };
    }
}
