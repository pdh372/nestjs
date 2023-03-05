import { Request } from 'express';
import { Details } from 'express-useragent';

export interface IAppReq extends Request {
    useragent: Details;
}
