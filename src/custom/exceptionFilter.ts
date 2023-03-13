import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
    InternalServerErrorException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@interface/config.interface';
import { ENV } from '@constant/config.const';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { Response } from 'express';
import { IAppReq } from '@interface/express.interface';
import { IWriteInternalServerLog } from '@interface/custom.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
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

    private async writeErrorLog(param: IWriteInternalServerLog) {
        const { req, httpAdapter, error } = param;
        const errorLog = await this.models.ErrorLog.create({
            path: httpAdapter.getRequestUrl(req) || req.path,
            method: httpAdapter.getRequestMethod(req) || req.method,
            errorDetail: error,
            metadata: {
                query: req.query,
                params: req.params,
                body: req.body,
                user: req.user,
            },
        });

        return {
            errorId: this.configService.get('node_env') === ENV.Staging ? errorLog?._id : undefined,
            errorDev: this.configService.get('node_env') === ENV.Development ? errorLog : undefined,
        };
    }
}
