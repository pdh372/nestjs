import { INestApplication, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as useragent from 'express-useragent';
import * as hpp from 'hpp';
import { IConfigService } from '@interface/config.interface';
import helmet from 'helmet';
import * as compression from 'compression';
import * as session from 'express-session';
import * as connectMongoDbSession from 'connect-mongodb-session';
import { ENV } from '@constant/config.const';
import { appColor } from '@helper/chalk.helper';
import { RedisIoAdapter } from '@module/gateway/gateway.adapter';
import { RedisClientType } from 'redis';
import { InjectRedisInstance } from '@module/redis/redis.helper';
import * as INJECT_TOKEN from '@constant/injectionToken.const';

@Injectable()
export class AppService {
    constructor(
        @Inject(ConfigService) private readonly configService: IConfigService,
        @InjectRedisInstance(INJECT_TOKEN.REDIS.ADAPTER) private readonly redis: RedisClientType,
    ) {}

    private get session() {
        const MongoDBStore = connectMongoDbSession(session);

        const store = new MongoDBStore({
            uri: this.configService.get('mongodb_url') as string,
            collection: 'session',
            expires: this.configService.get('session_store_expire'),
        });

        return session({
            secret: this.configService.get('session_secret') as string,
            name: this.configService.get('session_name'),
            store,

            // Set to false to prevent unnecessary session saves,
            // Set to true session will be saved even it no change
            resave: false,

            // For example, let's say a user visits a website for the first time and immediately leaves without performing any actions. If saveUninitialized is set to true,
            // <BOLD> a new session will still be created </BOLD>
            // For that user, even though no session data has been stored. This can potentially waste server resources, especially if there are many users who visit the website and leave without performing any actions.
            saveUninitialized: false,

            cookie: {
                maxAge: this.configService.get('session_cookie_max_age'),
                httpOnly: true,
                sameSite: 'strict',

                // Set to true, tell client don't send cookie back if client don't using https
                secure: ENV.Development !== this.configService.get('node_env'),
            },
        });
    }

    get middlewares() {
        const middlewares = [this.hpp, this.helmet];

        if (this.configService.get('useragent')) {
            middlewares.push(this.useragent);
        }

        if (this.configService.get('compression')) {
            middlewares.push(this.compression);
        }

        if (this.configService.get('session_secret')) {
            middlewares.push(this.session);
        }

        return middlewares;
    }

    get corsOption() {
        const corsOrigins = (this.configService.get('cors_origins') || '*').split(',');
        appColor(`???? Cors allowed: ${corsOrigins.join(' --- ')}`);
        return {
            origin: [...corsOrigins],
            credentials: true,
        };
    }

    get env() {
        return this.configService.get('node_env');
    }

    get port() {
        return +this.configService.get('port');
    }

    private get useragent() {
        return useragent.express();
    }

    private get hpp() {
        return hpp();
    }

    private get helmet() {
        return helmet();
    }

    private get compression() {
        return compression({
            filter: (req, res) => {
                if (req.headers['x-no-compression']) {
                    // don't compress responses if the client requests it
                    return false;
                }

                return compression.filter(req, res);
            },
        });
    }

    async createAdapter(app: INestApplication) {
        const redisIoAdapter = new RedisIoAdapter(app);
        await redisIoAdapter.connectToRedis({ redis: this.redis, configService: this.configService });
        return redisIoAdapter;
    }
}
