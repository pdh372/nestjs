import { IsBoolean, IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ENV } from '@constant/config.const';
import { errColor, appColor } from '@helper/chalk.helper';

class EnvironmentVariables {
    @IsString()
    APP_NAME: string;

    @IsEnum(ENV)
    NODE_ENV: ENV;

    @IsNumber()
    PORT: number;

    @IsString({})
    CORS_ORIGINS: string;

    @IsBoolean()
    DEBUG_MONGOOSE_TRANSACTION: boolean;
    @IsBoolean()
    DEBUG_MONGOOSE_MODEL: boolean;
    @IsBoolean()
    DEBUG_GLOBAL_PIPE: boolean;
    @IsBoolean()
    DEBUG_GLOBAL_INTERCEPTOR: boolean;

    @IsString()
    MONGODB_URI: string;

    @IsString()
    CIPHER_KEY: string;
    @IsString()
    CIPHER_IV: string;

    @IsBoolean()
    USERAGENT: boolean;
    @IsBoolean()
    COMPRESSION: boolean;

    @IsString()
    SESSION_SECRET: string;
    SESSION_NAME: string;
    @IsNumber()
    SESSION_COOKIE_MAX_AGE: number;
    @IsNumber()
    SESSION_STORE_EXPIRE: number;
}

export function validateEnv2(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        errColor(...errors.map(e => Object.values(e.constraints || {}).toString()));
        process.exit(1);
    }

    appColor('🍺 Env initialized');
    return validatedConfig;
}
