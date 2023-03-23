import { Body, Controller, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { Types } from 'mongoose';
import { AUTH } from 'src/constant/error.const';
import * as IT from 'src/constant/injectionToken.const';
import { IUserVerified } from 'src/api/controller/auth/auth.interface';

@Controller('auth')
export class AuthService {
    constructor(
        private readonly models: MongodbService,
        @Inject(IT.JWT.USER.ACCESS_TOKEN) private readonly userAccessToken: JwtService,
        @Inject(IT.JWT.USER.REFRESH_TOKEN) private readonly userRefreshToken: JwtService,
    ) {}

    @Post('sign-user')
    signUserToken(@Body() params: { _id: string | Types.ObjectId }) {
        return {
            accessToken: this.userAccessToken.sign({ _id: params._id }),
            refreshToken: this.userRefreshToken.sign({ _id: params._id }),
        };
    }

    @Post('verify-rt')
    verifyUserRefreshToken(@Body() params: { refreshToken: string }) {
        try {
            const data = this.userRefreshToken.verify<IUserVerified>(params.refreshToken);
            return data;
        } catch (error) {
            return error.message;
        }
    }

    @Post('verify-at')
    verifyUserAccessToken(@Body() params: { accessToken: string }) {
        try {
            const data = this.userAccessToken.verify<IUserVerified>(params.accessToken);
            return data;
        } catch (error) {
            return null;
        }
    }

    @Post('sign-at')
    signUserAccessToken(@Body() params: { _id: string | Types.ObjectId }) {
        return {
            accessToken: this.userAccessToken.sign({ _id: params._id }),
        };
    }
}
