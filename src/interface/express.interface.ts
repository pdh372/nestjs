import { Request } from 'express';
import { Details } from 'express-useragent';

// DEFAULT - SETUP
export interface IAppReq extends Request {
    useragent?: Details;
    user?: any;
}

// APP
