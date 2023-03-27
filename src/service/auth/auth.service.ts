import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import * as IT from '@constant/injection-token.const';
import { IUserVerified } from '@service/auth/auth.interface';
import { ERROR_AUTH } from '@constant/error.const';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { comparePassword } from '@util/string';
import { User } from '@repository/mongodb/model/user.model';

export class AuthService {
    constructor(
        @Inject(IT.JWT.USER.ACCESS_TOKEN) private readonly userAccessToken: JwtService,
        @Inject(IT.JWT.USER.REFRESH_TOKEN) private readonly userRefreshToken: JwtService,
        private readonly models: MongodbService,
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
            return this.userRefreshToken.verify<IUserVerified>(params.refreshToken);
        } catch (error) {
            return null;
        }
    }

    verifyUserAccessToken(params: { accessToken: string }) {
        try {
            return this.userAccessToken.verify<IUserVerified>(params.accessToken);
        } catch (error) {
            switch (error?.message) {
                case 'jwt expired': {
                    throw new Error(ERROR_AUTH.TOKEN_EXPIRED);
                }

                default: {
                    return null;
                }
            }
        }
    }

    signUserAccessToken(params: { _id: string | Types.ObjectId }) {
        const data: IUserVerified = { _id: params._id.toString() };
        return {
            accessToken: this.userAccessToken.sign(data),
        };
    }

    async validateUser(mobileNumber: string, pass: string): Promise<User | null> {
        const user = await this.models.User.findOne({ mobileNumber });

        if (user && (await comparePassword(pass, user.password))) {
            return user;
        }

        return null;
    }
}
