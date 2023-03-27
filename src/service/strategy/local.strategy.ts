import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from '@service/auth/auth.service';
import { ERROR_AUTH, ERROR_USER } from '@constant/error.const';
import { comparePassword } from '@util/string';
import { userSerialization } from '@serialization/user.serialization';
import * as moment from 'moment';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { tempLockHelper } from '@helper/temp-lock.helper';
import { TL_TYPE } from '@interceptor/temp-lock/temp-lock.const';
import { plainToInstance } from 'class-transformer';
import { UserLoginDTO } from '@api/user/user.dto';
import { validateSync } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, private models: MongodbService) {
        super({ passReqToCallback: true, usernameField: 'mobileNumber', session: true });
    }

    async validate(req: IAppReq) {
        try {
            const isTempLocked = tempLockHelper({ req, data: { lockType: TL_TYPE.LOGIN } });
            if (isTempLocked.error) {
                throw new Error(ERROR_AUTH.TEMP_LOCKED);
            }

            req = isTempLocked.req;
            const body = plainToInstance(UserLoginDTO, req.body);
            // eslint-disable-next-line no-var
            var errors: any[] = validateSync(body, { skipMissingProperties: false });
            if (errors.length > 0) {
                errors = errors.map(e => Object.values(e.constraints)).flat();
                throw new Error(ERROR_AUTH.BAD_REQUEST);
            }

            const { mobileNumber, password } = req.body;
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
            let info = error.message;

            switch (info) {
                case ERROR_USER.PASSWORD_NOT_MATCH:
                case ERROR_USER.ACCOUNT_NOT_FOUND: {
                    info = ERROR_AUTH.LOGIN_UNSUCCESSFULLY;
                    if (failed >= req.maxAttempt) {
                        info = ERROR_AUTH.TEMP_LOCKED;
                        req.session[req.attemptsKey] = 0;
                        lockedUntil = moment().add(req.lockTime, 'minutes').toDate();
                        req.session[req.lockedUntilKey] = lockedUntil;
                    }
                    break;
                }

                case ERROR_AUTH.TEMP_LOCKED: {
                    throw new HttpException(
                        {
                            info,
                            lockedUntil: req.session[req.lockedUntilKey],
                            failed: req.maxAttempt,
                        },
                        HttpStatus.TOO_MANY_REQUESTS,
                    );
                }

                case ERROR_AUTH.BAD_REQUEST: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    throw new BadRequestException(errors);
                }

                default: {
                    break;
                }
            }

            if (lockedUntil) {
                throw new HttpException(
                    {
                        info,
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
}
