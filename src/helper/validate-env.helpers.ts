import { IsBoolean, IsEnum, IsNumber, IsString, validateSync, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform, plainToInstance } from 'class-transformer';
import { ENV } from '@constant/config.const';
import { warnColor, appColor } from '@helper/chalk.helper';

const stringToBoolean = (t: any) => {
    return t.value === 'true';
};

const stringToNumber = (t: any) => {
    if (isNaN(t.value)) return t.value;
    return +t.value;
};

class EnvironmentVariables {
    @IsNotEmpty()
    @IsString()
    APP_NAME: string;

    @IsEnum(ENV)
    NODE_ENV: ENV;

    @IsNumber()
    PORT: number;

    @IsString({})
    CORS_ORIGINS = '*';

    @Transform(stringToBoolean)
    @IsBoolean()
    DEBUG_MONGOOSE_TRANSACTION = false;

    @Transform(stringToBoolean)
    @IsBoolean()
    DEBUG_MONGOOSE_MODEL = false;

    @Transform(stringToBoolean)
    @IsBoolean()
    DEBUG_GLOBAL_PIPE = false;

    @Transform(stringToBoolean)
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

    @IsBoolean()
    @Transform(stringToBoolean)
    USERAGENT = true;

    @IsBoolean()
    @Transform(stringToBoolean)
    COMPRESSION = false;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    SESSION_SECRET: string;

    @IsNotEmpty()
    @IsString()
    SESSION_NAME: string;

    @IsNumber()
    @Transform(stringToNumber)
    SESSION_COOKIE_MAX_AGE = 86400000;

    @IsNumber()
    @Transform(stringToNumber)
    SESSION_STORE_EXPIRE = 172800;

    @IsNotEmpty()
    @IsString()
    REDIS_URL: string;

    @IsNumber()
    @Transform(stringToNumber)
    REDIS_DATABASE = 0;

    // KEYs FOR USER
    @IsString()
    JWT_PRIVATE_KEY: string;
    @IsString()
    JWT_PUBLIC_KEY: string;
    @IsString()
    JWT_SECRET_KEY: string;
}

export function validateEnvironment(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        warnColor(...errors.map(e => Object.values(e.constraints || {}).toString()));
        process.exit(1);
    }

    appColor('🍺 Env initialized');
    return validatedConfig;
}
