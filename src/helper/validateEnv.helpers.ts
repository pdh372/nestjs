import { IsBoolean, IsEnum, IsNumber, IsString, validateSync, IsOptional, IsNotEmpty } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ENV } from '@constant/config.const';
import { errColor, appColor } from '@helper/chalk.helper';

class EnvironmentVariables {
    @IsNotEmpty()
    @IsString()
    APP_NAME: string;

    @IsEnum(ENV)
    NODE_ENV: ENV;

    @IsNumber()
    PORT: number;

    @IsOptional()
    @IsString({})
    CORS_ORIGINS = '*';

    @IsBoolean()
    DEBUG_MONGOOSE_TRANSACTION: false;
    @IsBoolean()
    DEBUG_MONGOOSE_MODEL: false;
    @IsBoolean()
    DEBUG_GLOBAL_PIPE: false;
    @IsBoolean()
    DEBUG_GLOBAL_INTERCEPTOR: false;

    @IsString()
    @IsNotEmpty()
    MONGODB_URI: string;

    @IsNotEmpty()
    @IsString()
    CIPHER_KEY: string;
    @IsNotEmpty()
    @IsString()
    CIPHER_IV: string;

    @IsOptional()
    @IsBoolean()
    USERAGENT: true;
    @IsOptional()
    @IsBoolean()
    COMPRESSION: false;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    SESSION_SECRET: string;
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    SESSION_NAME: string;
    @IsOptional()
    @IsNumber()
    SESSION_COOKIE_MAX_AGE: 86400000;
    @IsOptional()
    @IsNumber()
    SESSION_STORE_EXPIRE: 172800;
}

export function validateEnvironment(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        errColor(...errors.map(e => Object.values(e.constraints || {}).toString()));
        process.exit(1);
    }

    appColor('🍺 Env initialized');
    return validatedConfig;
}
