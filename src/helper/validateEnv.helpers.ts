import { IsBoolean, IsEnum, IsNumber, IsString, validateSync, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform, plainToInstance } from 'class-transformer';
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

    @Transform(t => t.value === 'true')
    @IsBoolean()
    DEBUG_MONGOOSE_TRANSACTION = false;
    @Transform(t => t.value === 'true')
    @IsBoolean()
    DEBUG_MONGOOSE_MODEL = false;
    @Transform(t => t.value === 'true')
    @IsBoolean()
    DEBUG_GLOBAL_PIPE = false;
    @Transform(t => t.value === 'true')
    @IsBoolean()
    DEBUG_GLOBAL_INTERCEPTOR = false;

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
    @Transform(t => t.value === 'true')
    USERAGENT = true;
    @IsOptional()
    @IsBoolean()
    @Transform(t => t.value === 'true')
    COMPRESSION = false;

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
    @Transform(t => +t.value)
    SESSION_COOKIE_MAX_AGE = 86400000;
    @IsOptional()
    @IsNumber()
    @Transform(t => +t.value)
    SESSION_STORE_EXPIRE = 172800;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    REDIS_URL: string;

    @IsOptional()
    @IsNumber()
    @Transform(t => +t.value)
    REDIS_DATABASE = 0;
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
