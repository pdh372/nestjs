import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@interface/config.interface';
import { ENV } from '@constant/config.const';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory(configService: IConfigService) {
                const user_key = configService.get('keys').user;
                return {
                    signOptions: {
                        expiresIn: '7 days',
                        issuer: 'pdh372@gmail.com',
                    },
                    publicKey: user_key.public_key,
                    privateKey: user_key.private_key,
                    verifyOptions: { ignoreExpiration: configService.get('node_env') === ENV.Development },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
})
export class AuthModule {}
