/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import * as INJECT_TOKEN from '@constant/injection-token.const';
import { Schema } from 'mongoose';

interface IInjectTokenEncrypt {
    key: string;
    iv: string;
}

@Injectable()
export class EncryptService {
    constructor(@Inject(INJECT_TOKEN.ENCRYPT) private readonly cipher: IInjectTokenEncrypt) {}

    encryptSchema = ({ schema, fields }: { schema: Schema; fields: string[] }) => {
        const { sanitizeEncrypt, sanitizeDecrypt, decryptFields } = this;
        // @ts-ignore
        schema.pre(['find', 'findOne', 'countDocuments', 'exists', 'findOneAndUpdate'], function () {
            fields.forEach(field => {
                // @ts-ignore
                if (this._conditions[field]) this._conditions[field] = sanitizeEncrypt(this._conditions[field]);
            });
        });

        schema.pre('save', function () {
            fields.forEach(field => {
                // @ts-ignore
                if (this[field]) this[field] = sanitizeEncrypt(this[field]);
            });
        });

        schema.post('save', function () {
            fields.forEach(field => {
                // @ts-ignore
                if (this && this[field]) this[field] = sanitizeDecrypt(this[field]);
            });
        });

        // @ts-ignore
        schema.post('findById', decryptFields(fields));
        schema.post('findOneAndUpdate', decryptFields(fields));
        schema.post('findOne', decryptFields(fields));
        schema.post(['find'], function (result) {
            result.map(decryptFields(fields));
        });

        return schema;
    };

    private sanitizeDecrypt = (value: any): any => {
        switch (this.typeOf(value)) {
            case 'array': {
                return value.map(this.sanitizeDecrypt);
            }
            case 'object': {
                const keys = Object.keys(value);
                return Object.fromEntries(keys.map(k => [k, this.sanitizeDecrypt(value[k])]));
            }

            default: {
                return this.decrypt(value);
            }
        }
    };

    private sanitizeEncrypt = (value: any): any => {
        switch (this.typeOf(value)) {
            case 'array': {
                return value.map(this.sanitizeEncrypt);
            }
            case 'object': {
                const keys = Object.keys(value);
                return Object.fromEntries(keys.map(k => [k, this.sanitizeEncrypt(value[k])]));
            }

            default: {
                return this.encrypt(value);
            }
        }
    };

    private decryptFields = (ENCRYPT_FIELDS: string[]) => {
        return (data: { [x: string]: any }) => {
            ENCRYPT_FIELDS.forEach(field => {
                if (data && data[field]) data[field] = this.sanitizeDecrypt(data[field]);
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
