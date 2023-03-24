import { Request } from 'express';
import session from 'express-session';
import { Details } from 'express-useragent';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '@interface/config.interface';

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

    type IConfigService = ConfigService<IAppConfig>;
}

export {};
