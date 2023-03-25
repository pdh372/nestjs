import {
    Body,
    Controller,
    Post,
    Req,
    NotFoundException,
    HttpException,
    HttpStatus,
    HttpCode,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@src/api/service/auth/auth.service';
import { UserSignUpDTO, UserLoginDTO, RefreshTokenDTO } from '@router/user/user.dto';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { ERROR_AUTH, ERROR_USER, TEMP_LOCKED } from '@constant/error.const';
import { hashPassword, comparePassword } from '@util/string';
import { userSerialization } from '@serialization/user.serialization';
import * as moment from 'moment';
import { LA_TYPE, LockAction } from '@custom/interceptor/lock-action';
import { TL_TYPE, TempLock } from '@custom/interceptor/temp-lock';

@Controller({ path: 'user/public' })
export class UserPublicController {
    constructor(private authService: AuthService, private models: MongodbService) {}

    @LockAction({ lockType: LA_TYPE.SIGNUP })
    @TempLock({ lockType: TL_TYPE.SIGNUP })
    @Post('signup')
    async handleSignup(@Body() body: UserSignUpDTO, @Req() req: IAppReq) {
        try {
            const { mobileNumber, password } = body;

            const isExists = await this.models.User.exists({ mobileNumber });
            if (isExists) throw new Error(ERROR_USER.ACCOUNT_EXISTS);

            const newUser = await this.models.User.create({
                password: await hashPassword(password),
                mobileNumber,
            });

            req.session[req.attemptsKey] = 0;
            req.session[req.lockedUntilKey] = undefined;

            return {
                token: this.authService.signUserToken({ _id: newUser._id }),
                user: userSerialization(newUser),
            };
        } catch (error) {
            const failed = req.session[req.attemptsKey];
            let lockedUntil = req.session[req.lockedUntilKey];

            switch (error.message) {
                case ERROR_USER.ACCOUNT_EXISTS: {
                    if (failed >= req.maxAttempt) {
                        req.session[req.attemptsKey] = 0;
                        lockedUntil = moment().add(req.lockTime, 'minutes').toDate();
                        req.session[req.lockedUntilKey] = lockedUntil;
                    }
                    break;
                }

                default: {
                    break;
                }
            }

            if (lockedUntil) {
                throw new HttpException(
                    {
                        info: TEMP_LOCKED,
                        lockedUntil: req.session[req.lockedUntilKey],
                        failed: req.maxAttempt,
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }

            throw new NotFoundException({
                info: ERROR_USER.SIGNUP_UNSUCCESSFULLY,
                lockedUntil,
                failed,
            });
        }
    }

    @TempLock({ lockType: TL_TYPE.LOGIN })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async handleLogin(@Body() body: UserLoginDTO, @Req() req: IAppReq) {
        try {
            const { mobileNumber, password } = body;

            const user = await this.models.User.findOne({ mobileNumber }).lean();
            if (!user) {
                throw new Error(ERROR_USER.ACCOUNT_NOT_FOUND);
            }
            if (!(await comparePassword(password, user.password))) {
                throw new Error(ERROR_USER.PASSWORD_NOT_MATCH);
            }

            req.session[req.attemptsKey] = 0;
            req.session[req.lockedUntilKey] = undefined;

            return {
                token: this.authService.signUserToken({ _id: user._id }),
                user: userSerialization(user),
            };
        } catch (error) {
            const failed = req.session[req.attemptsKey];
            let lockedUntil = req.session[req.lockedUntilKey];

            switch (error.message) {
                case ERROR_USER.PASSWORD_NOT_MATCH:
                case ERROR_USER.ACCOUNT_NOT_FOUND: {
                    if (failed >= req.maxAttempt) {
                        req.session[req.attemptsKey] = 0;
                        lockedUntil = moment().add(req.lockTime, 'minutes').toDate();
                        req.session[req.lockedUntilKey] = lockedUntil;
                    }
                    break;
                }

                default: {
                    break;
                }
            }

            if (lockedUntil) {
                throw new HttpException(
                    {
                        info: TEMP_LOCKED,
                        lockedUntil: req.session[req.lockedUntilKey],
                        failed: req.maxAttempt,
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }

            throw new NotFoundException({
                info: ERROR_USER.LOGIN_UNSUCCESSFULLY,
                lockedUntil,
                failed,
            });
        }
    }

    @TempLock({ lockType: TL_TYPE.REFRESH_TOKEN })
    @Post('refreshToken')
    async handleRefreshToken(@Body() body: RefreshTokenDTO, @Req() req: IAppReq) {
        const { refreshToken } = body;

        const data = this.authService.verifyUserRefreshToken({ refreshToken });
        if (!data) {
            throw new UnauthorizedException({ info: ERROR_AUTH.INVALID_TOKEN });
        }

        req.session[req.attemptsKey] = 0;
        req.session[req.lockedUntilKey] = undefined;

        const { accessToken } = this.authService.signUserAccessToken({ _id: data._id });
        return {
            accessToken,
        };
    }
}
