import { LogLevel } from '@nestjs/common';
import { IAppConfig } from '@interface/config.interface';
import { INodeENV } from '@interface/config.interface';

export const APP_GLOBAL_CONFIG = (): IAppConfig => ({
    node_env: (process.env.NODE_ENV || 'development') as INodeENV,
    port: parseInt(process.env.PORT || '3000', 10),
    mongodb_url: process.env.DB_URI as string,
    debug_mongoose: process.env.DEBUG_MONGOOSE === 'true',
    debug_global_pipe: process.env.DEBUG_GLOBAL_PIPE === 'true',
    debug_global_interceptor: process.env.DEBUG_GLOBAL_INTERCEPTOR === 'true',
});

export const LOGGERS: LogLevel[] = ['error', 'warn', 'verbose', 'debug'];

export const ENV_FILE_PATH = ['.env.development', '.env.example', '.env.staging', '.env.pentest', '.env.production'];
