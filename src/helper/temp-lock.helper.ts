import * as moment from 'moment';
import { ITempLockMetadata } from '@custom/interceptor/temp-lock';
import { ERROR_AUTH } from '@constant/error.const';

export const tempLockHelper = ({ req, data }: { req: IAppReq; data: ITempLockMetadata }) => {
    const { lockType, maxAttempt = 5, lockTime = 5 } = data;
    req.attemptsKey = `${lockType}_attempts`;
    req.lockedUntilKey = `${lockType}_locked_until`;
    req.maxAttempt = maxAttempt;
    req.lockTime = lockTime;

    if (req.session[req.lockedUntilKey] > new Date()) {
        return {
            req,
            error: ERROR_AUTH.TEMP_LOCKED,
        };
    }

    req.session[req.attemptsKey] = (+req.session[req.attemptsKey] || 0) + 1;
    if (req.session[req.attemptsKey] > maxAttempt) {
        req.session[req.lockedUntilKey] = moment().add(lockTime, 'minutes').toDate();
        req.session[req.attemptsKey] = 0;
        return {
            req,
            error: ERROR_AUTH.TEMP_LOCKED,
        };
    }

    req.session[req.lockedUntilKey] = undefined;
    return { req, error: null };
};
