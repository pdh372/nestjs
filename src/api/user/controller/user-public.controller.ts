import {
    Body,
    Controller,
    Post,
    Req,
    HttpException,
    HttpStatus,
    HttpCode,
    UnauthorizedException,
    UseFilters,
    ConflictException,
} from '@nestjs/common';
import { AuthService } from '@service/auth/auth.service';
import { UserSignUpDTO, RefreshTokenDTO } from '@api/user/user.dto';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { ERROR_AUTH, ERROR_USER } from '@constant/error.const';
import { hashPassword } from '@util/string';
import { userSerialization } from '@serialization/user.serialization';
import { LA_TYPE, LockAction } from '@interceptor/lock-action';
import { TL_TYPE, TempLock } from '@interceptor/temp-lock';
import { AuthenException } from '@exception/authen/authen.exception';
import { LocalPassport } from '@module/strategy-passport';
import { USER_ROUTE_PUBLIC } from '@api/api.router';

const { CONTROLLER, ROUTE } = USER_ROUTE_PUBLIC;

@UseFilters(AuthenException)
@Controller({ path: CONTROLLER })
export class UserPublicController {
    constructor(private authService: AuthService, private models: MongodbService) {}

    @LockAction({ lockType: LA_TYPE.SIGNUP })
    @TempLock({ lockType: TL_TYPE.SIGNUP })
    @Post(ROUTE.SIGNUP)
    async signupLocal(@Body() body: UserSignUpDTO, @Req() req: IAppReq) {
        try {
            const { mobileNumber, password } = body;

            const isExists = await this.models.User.exists({ mobileNumber });
            if (isExists) {
                req.session[req.attemptsKey]--;
                throw new Error(ERROR_USER.ACCOUNT_ALREADY_EXISTS);
            }

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
            const lockedUntil = req.session[req.lockedUntilKey];
            const info = error.message;

            switch (info) {
                case ERROR_USER.ACCOUNT_ALREADY_EXISTS: {
                    throw new ConflictException({ info });
                }

                default: {
                    break;
                }
            }

            if (lockedUntil) {
                throw new HttpException(
                    {
                        info: ERROR_AUTH.TEMP_LOCKED,
                        lockedUntil: req.session[req.lockedUntilKey],
                        failed: req.maxAttempt,
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }

            throw new UnauthorizedException({
                info,
                lockedUntil,
                failed,
            });
        }
    }

    @TempLock({ lockType: TL_TYPE.REFRESH_TOKEN })
    @Post(ROUTE.REFRESH_TOKEN)
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

    @LocalPassport()
    @HttpCode(HttpStatus.OK)
    @Post(ROUTE.LOGIN)
    async loginLocal(@Req() req: IAppReq) {
        return {
            token: this.authService.signUserToken({ _id: req.user._id }),
            user: userSerialization(req.user),
        };
    }
}
