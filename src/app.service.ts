import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as useragent from 'express-useragent';
import * as hpp from 'hpp';
import { IConfigService } from '@interface/config.interface';
import helmet from 'helmet';
import * as compression from 'compression';

@Injectable()
export class AppService {
    constructor(@Inject(ConfigService) private readonly configService: IConfigService) {}

    get middlewares() {
        return [
            useragent.express(),
            hpp(),
            helmet(),
            compression({
                filter: (req, res) => {
                    if (req.headers['x-no-compression']) {
                        // don't compress responses if the client requests it
                        return false;
                    }
                    // fallback to default filter function
                    return compression.filter(req, res);
                },
            }),
        ];
    }

    get corsOption() {
        const corsOrigins = this.configService.get('cors_origins');
        return {
            origin: [...corsOrigins.split(',')],
            credentials: true,
        };
    }

    get env() {
        return this.configService.get('node_env');
    }

    get port() {
        return +this.configService.get('port');
    }
}
