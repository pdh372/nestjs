import { AbstractHttpAdapter } from '@nestjs/core';
import { IAppReq } from '@interface/express.interface';

export interface IWriteInternalServerLog {
    req: IAppReq;
    error: unknown;
    httpAdapter: AbstractHttpAdapter<any, any, any>;
}
