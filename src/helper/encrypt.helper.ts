import { Inject, Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import * as INJECT_TOKEN from '@constant/injectionToken.const';
import { IConfigService } from '@interface/config.interface';
import { IInjectTokenEncrypt } from '@interface/useProvider.interface';

@Injectable()
export class EncryptService {
    constructor(@Inject(INJECT_TOKEN.ENCRYPT) private readonly cipher: IInjectTokenEncrypt) {}

    decryptModel = (value: any): any => {
        switch (this.typeOf(value)) {
            case 'array': {
                return value.map(this.decryptModel);
            }
            case 'object': {
                const keys = Object.keys(value);
                return Object.fromEntries(keys.map(k => [k, this.decryptModel(value[k])]));
            }

            default: {
                return this.decrypt(value);
            }
        }
    };

    encryptModel = (value: any): any => {
        switch (this.typeOf(value)) {
            case 'array': {
                return value.map(this.encryptModel);
            }
            case 'object': {
                const keys = Object.keys(value);
                return Object.fromEntries(keys.map(k => [k, this.encryptModel(value[k])]));
            }

            default: {
                return this.encrypt(value);
            }
        }
    };

    decryptFields = (ENCRYPT_FIELDS: string[]) => {
        return (data: { [x: string]: any }) => {
            ENCRYPT_FIELDS.forEach(field => {
                if (data && data[field]) data[field] = this.decryptModel(data[field]);
            });
        };
    };

    private typeOf = (value: any): 'string' | 'undefined' | 'symbol' | 'number' | 'null' | 'array' | 'object' => {
        const str: string = Object.prototype.toString.call(value);
        return str.slice(8, -1).toLowerCase() as any;
    };

    private encrypt(value: string) {
        if (!_.isString(value)) return value;
        if (!value || value === 'null' || value === 'undefined') return '';

        const cipher = crypto.createCipheriv('aes-256-cbc', this.cipher.key, this.cipher.iv);

        let encrypted = cipher.update(value + '', 'utf8', 'base64');
        encrypted += cipher.final('base64');

        return encrypted;
    }

    private decrypt = (encrypted: string) => {
        try {
            if (!encrypted || encrypted === 'null' || encrypted === 'undefined') return '';

            const decipher = crypto.createDecipheriv('aes-256-cbc', this.cipher.key, this.cipher.iv);

            const decrypted = decipher.update(encrypted, 'base64', 'utf8');

            return decrypted + decipher.final('utf8');
        } catch (err) {
            console.error(err);
            return encrypted;
        }
    };
}

@Module({
    providers: [
        {
            provide: INJECT_TOKEN.ENCRYPT,
            useFactory: (configService: IConfigService): IInjectTokenEncrypt => {
                return {
                    key: configService.get('cipher_key') as string,
                    iv: configService.get('cipher_iv') as string,
                };
            },
            inject: [ConfigService],
        },
        EncryptService,
    ],
    exports: [EncryptService],
})
export class EncryptModule {}
