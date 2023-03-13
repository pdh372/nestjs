import { AbstractHttpAdapter } from '@nestjs/core';
import { IAppReq } from '@interface/express.interface';
import { Socket } from 'socket.io';
import { ArgumentsHost } from '@nestjs/common';

export interface IWriteHttpErrorLog {
    req: IAppReq;
    error: unknown;
    httpAdapter: AbstractHttpAdapter<any, any, any>;
}

export interface IWriteWsErrorLog {
    socket: Socket;
    data: any;
    error: unknown;
    host: ArgumentsHost;
}
