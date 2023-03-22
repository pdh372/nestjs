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
import { BadRequestException } from '@nestjs/common';
import { ILogInternal, ILogValidate } from 'src/interface/custom.interface';

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
        const { res, req } = this.getContext(host);

        const httpCode = exception.getStatus();

        const errorLog = await this.showLogInternalDetail({ httpCode, req, error, host });
        const errorValidate = this.showLogValidateDetail({ exception, error });

        const responsePayload = {
            statusCode: httpCode,
            errorMessage: exception.message,
            errorLog,
            errorValidate,
        };

        httpAdapter.reply(res, responsePayload, httpCode);
    }

    private async writeErrorLog(param: IWriteHttpErrorLog) {
        const { req, host, error } = param;
        const errorLog = await this.models.ErrorLog.create({
            path: req.path,
            errorDetail: error,
            query: req.query,
            metadata: {
                method: req.method,
                params: req.params,
                body: req.body,
                user: req.user,
            },
            contextType: host.getType(),
        });

        return {
            errorId: this.configService.get('node_env') === ENV.Staging ? errorLog?._id : undefined,
            errorDev: this.configService.get('node_env') === ENV.Development ? errorLog : undefined,
        };
    }

    private getContext(host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        return {
            req: ctx.getRequest<IAppReq>(),
            res: ctx.getResponse<Response>(),
        };
    }

    private async showLogInternalDetail({ httpCode, req, error, host }: ILogInternal) {
        if (httpCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            const data = await this.writeErrorLog({ req, error, host });
            if (!Object.values(data).filter(Boolean).length) return undefined;
            return data;
        }
    }

    private showLogValidateDetail({ exception, error }: ILogValidate) {
        if (
            [ENV.Development, ENV.Staging].includes(this.configService.get('node_env') as ENV) &&
            error instanceof BadRequestException
        ) {
            return (exception.getResponse() as unknown as any)?.message;
        }
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
