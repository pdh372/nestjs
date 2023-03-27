import { Socket } from 'socket.io';
import { ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';

export interface IWriteHttpErrorLog {
    req: IAppReq;
    error: unknown;
    host: ArgumentsHost;
}

export interface IWriteWsErrorLog {
    socket: Socket;
    data: any;
    error: unknown;
    host: ArgumentsHost;
}

export interface ILogInternal {
    httpCode: HttpStatus;
    req: IAppReq;
    error: unknown;
    host: ArgumentsHost;
}

export interface ILogValidate {
    error: unknown;
    exception: HttpException;
}
