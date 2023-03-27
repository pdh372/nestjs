import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { ERROR_AUTH, ERROR_USER } from '@constant/error.const';
import { comparePassword } from '@util/string';
import * as moment from 'moment';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { tempLockHelper } from '@helper/temp-lock.helper';
import { TL_TYPE } from '@interceptor/temp-lock/temp-lock.const';
import { UserLoginDTO } from '@api/user/user.dto';
import { validateBody } from '@util/validate';
import { STRATEGY_PASSPORT_TYPE } from '@module/strategy-passport/strategy-passport.const';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGY_PASSPORT_TYPE.LOCAL) {
    constructor(private models: MongodbService) {
        super({ passReqToCallback: true, usernameField: 'mobileNumber', session: true });
    }

    async validate(req: IAppReq) {
        try {
            const isTempLocked = tempLockHelper({ req, data: { lockType: TL_TYPE.LOGIN } });
            if (isTempLocked.error) {
                throw new Error(ERROR_AUTH.TEMP_LOCKED);
            }

            req = isTempLocked.req;

            // eslint-disable-next-line no-var
            var errors = await validateBody({ classDTO: UserLoginDTO, data: req.body });
            if (errors.length > 0) {
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

            return user;
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
                    if (failed >= req.maxAttempt) {
                        req.session[req.attemptsKey] = 0;
                        req.session[req.lockedUntilKey] = moment().add(req.lockTime, 'minutes').toDate();
                    }
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
