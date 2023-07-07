import { Request } from 'express';
import session from 'express-session';
import { Details } from 'express-useragent';
import { ConfigService } from '@nestjs/config';
import { APP_DATA_CONFIG } from 'src/constant/config.const';

type IAppSession = session.Session & Partial<session.SessionData> & Record<string, any>;

declare global {
    type MappedTypeConst<Properties> = {
        readonly [P in Properties as Uppercase<string & P>]: P;
    };

    interface IAppReq extends Request {
        useragent?: Details;
        user: User;
        session: IAppSession;
        keys?: string[];
        attemptsKey: string;
        lockedUntilKey: string;
        maxAttempt: number;
        lockTime: number; // in minute
    }

    type IConfigService = ConfigService<ReturnType<typeof APP_DATA_CONFIG>>;

    type ConstValue<T> = T extends Record<string | number | symbol, infer U> ? U : never;
}

export {};
