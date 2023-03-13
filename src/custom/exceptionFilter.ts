import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
    InternalServerErrorException,
    WsExceptionFilter,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@interface/config.interface';
import { ENV } from '@constant/config.const';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { Response } from 'express';
import { IAppReq } from '@interface/express.interface';
import { IWriteHttpErrorLog } from '@interface/custom.interface';
import { Socket } from 'socket.io';
import { IWriteWsErrorLog } from '@interface/custom.interface';
import { EVENT_PUB } from '@constant/eventSocket.const';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(ConfigService) private readonly configService: IConfigService,
        @Inject(MongodbService) private readonly models: MongodbService,
    ) {}

    async catch(error: HttpException | unknown, host: ArgumentsHost): Promise<void> {
        const exception = error instanceof HttpException ? error : new InternalServerErrorException();

        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<IAppReq>();
        const res = ctx.getResponse<Response>();

        const httpCode = exception.getStatus();

        let errorLog;
        if (httpCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            errorLog = await this.writeErrorLog({ req, error, httpAdapter });
        }

        const responsePayload = {
            statusCode: httpCode,
            message: exception.message,
            errorId: errorLog?.errorId,
            errorDev: errorLog?.errorDev,
        };

        httpAdapter.reply(res, responsePayload, httpCode);
    }

    private async writeErrorLog(param: IWriteHttpErrorLog) {
        const { req, httpAdapter, error } = param;
        const errorLog = await this.models.ErrorLog.create({
            path: httpAdapter.getRequestUrl(req) || req.path,
            errorDetail: error,
            query: req.query,
            metadata: {
                method: httpAdapter.getRequestMethod(req) || req.method,
                params: req.params,
                body: req.body,
                user: req.user,
            },
            contextType: httpAdapter.getType(),
        });

        return {
            errorId: this.configService.get('node_env') === ENV.Staging ? errorLog?._id : undefined,
            errorDev: this.configService.get('node_env') === ENV.Development ? errorLog : undefined,
        };
    }
}

@Catch()
export class AllWsExceptionsFilter implements WsExceptionFilter {
    constructor(
        @Inject(ConfigService) private readonly configService: IConfigService,
        @Inject(MongodbService) private readonly models: MongodbService,
    ) {}

    async catch(error: HttpException | unknown, host: ArgumentsHost): Promise<void> {
        const socket: Socket = host.switchToWs().getClient();
        const data = host.switchToWs().getData();
        const exception = error instanceof HttpException ? error : new InternalServerErrorException();
        const httpCode = exception.getStatus();

        let errorLog;
        if (httpCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            errorLog = await this.writeErrorLog({ data, error, host, socket });
        }

        const responsePayload = {
            statusCode: httpCode,
            message: exception.message,
            errorId: errorLog?.errorId,
            errorDev: errorLog?.errorDev,
        };

        socket.emit(EVENT_PUB.EXCEPTION, responsePayload);
    }

    private async writeErrorLog(param: IWriteWsErrorLog) {
        const { data, host, error, socket } = param;
        const errorLog = await this.models.ErrorLog.create({
            path: socket.handshake.url,
            errorDetail: error,
            contextType: host.getType(),
            query: socket.handshake.query,
            metadata: {
                message: data,
                auth: socket.handshake.auth,
            },
        });

        return {
            errorId: this.configService.get('node_env') === ENV.Staging ? errorLog?._id : undefined,
            errorDev: this.configService.get('node_env') === ENV.Development ? errorLog : undefined,
        };
    }
}
