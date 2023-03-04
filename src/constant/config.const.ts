import { LogLevel } from '@nestjs/common';
import { IAppConfig } from '@interface/config.interface';
import { INodeENV } from '@interface/config.interface';

export const APP_GLOBAL_CONFIG = (): IAppConfig => ({
    node_env: (process.env.NODE_ENV || 'development') as INodeENV,
    port: parseInt(process.env.PORT || '3000', 10),

    debug_mongoose_transaction: process.env.DEBUG_MONGOOSE_TRANSACTION === 'true',
    debug_mongoose_model: process.env.DEBUG_MONGOOSE_MODEL === 'true',
    debug_global_pipe: process.env.DEBUG_GLOBAL_PIPE === 'true',
    debug_global_interceptor: process.env.DEBUG_GLOBAL_INTERCEPTOR === 'true',

    mongodb_url: process.env.DB_URI || 'mongodb://localhost:27017/init-nestjs',

    cipher_key: process.env.CIPHER_KEY || '1111_2222_3333_4444_5555_6666_77',
    cipher_iv: process.env.CIPHER_IV || '11_22_33_44_55_6',
});

export const LOGGERS: LogLevel[] = ['error', 'warn', 'verbose', 'debug'];

export const ENV_FILE_PATH = ['.env.development', '.env.staging', '.env.pentest', '.env.production', '.env.example'];
