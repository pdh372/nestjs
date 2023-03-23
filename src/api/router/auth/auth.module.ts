/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@interface/config.interface';
import { ENV } from '@constant/config.const';
import * as IT from '@src/constant/injection-token.const';
import { TRoleSign } from '@src/api/router/auth/auth.interface';

@Global()
@Module({})
export class AuthModule {
    static register(): DynamicModule {
        const roles: TRoleSign[] = [
            {
                provide: IT.JWT.USER.ACCESS_TOKEN,
                signOptions: { expiresIn: '1h', algorithm: 'HS256' },
                secret: 'access_token.user',
            },
            {
                provide: IT.JWT.USER.REFRESH_TOKEN,
                signOptions: { expiresIn: '1m', algorithm: 'RS256' },
                publicKey: 'refresh_token.user.public_key',
                privateKey: 'refresh_token.user.private_key',
            },
        ];

        const providers: Provider[] = roles.map(role => {
            return {
                provide: role.provide,
                useFactory: (configService: IConfigService) => {
                    return new JwtService({
                        // @ts-ignore
                        signOptions: role.signOptions,
                        // @ts-ignore
                        publicKey: configService.get(role.publicKey),
                        // @ts-ignore
                        privateKey: configService.get(role.privateKey),
                        // @ts-ignore
                        secret: configService.get(role.secret),
                        verifyOptions: { ignoreExpiration: configService.get('node_env') === ENV.Development },
                    });
                },
                inject: [ConfigService],
            };
        });

        return {
            module: AuthModule,
            providers: [AuthService, ...providers],
            exports: [AuthService],
        };
    }
}
