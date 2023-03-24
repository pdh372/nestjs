import { Request } from 'express';
import session from 'express-session';
import { Details } from 'express-useragent';

type IAppSession = session.Session & Partial<session.SessionData> & Record<string, any>;

export interface IAppReq extends Request {
    useragent?: Details;
    user?: any;
    session: IAppSession;
    keys?: string[];
    attemptsKey?: string;
    lockedUntilKey?: string;
    maxAttempt?: number;
    lockTime?: number; // in minute
}
