/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@interface/config.interface';
import { ENV } from '@constant/config.const';
import * as IT from 'src/constant/injectionToken.const';
import { TRoleSign } from 'src/api/controller/auth/auth.interface';

@Module({
    controllers: [AuthService],
    providers: [],
})
export class AuthModule {
    static register(): DynamicModule {
        console.log(process.env.JWT_PRIVATE_KEY || ''.replace(/\\n/gm, '\n'));
        const roles: TRoleSign[] = [
            {
                provide: IT.JWT.USER.ACCESS_TOKEN,
                signOptions: { expiresIn: '1h', algorithm: 'HS256' },
                secret: 'access_token.user',
            },
            {
                provide: IT.JWT.USER.REFRESH_TOKEN,
                signOptions: { expiresIn: '7m', algorithm: 'RS256' },
                publicKey: 'refresh_token.user.public_key',
                privateKey: 'refresh_token.user.private_key',
            },
        ];

        const providers: Provider[] = roles.map(role => {
            return {
                provide: role.provide,
                useFactory: (configService: IConfigService) => {
                    // console.log(configService.get('refresh_token').user.private_key);
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
            providers,
            exports: [...roles.map(role => role.provide)],
        };
    }
}
