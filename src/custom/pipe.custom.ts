/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, PipeTransform, BadRequestException, ArgumentMetadata, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { appColor } from '@helper/chalk.helper';
import { logColor } from '@helper/chalk.helper';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@interface/config.interface';
interface IMyParseIntPipe {
    min?: number;
    max?: number;
}

@Injectable()
export class MyParseIntPipeWithCond implements PipeTransform<string, number> {
    _min;
    _max;
    constructor(params?: IMyParseIntPipe) {
        if (!params) return;
        this._min = params.min;
        this._max = params.max;
    }

    transform(value: string): number {
        const intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
            throw new BadRequestException(`${value} is not a number`);
        }

        if (this._min && this._min < intValue) {
            throw new BadRequestException(`${value} is greater than ${this._min}`);
        }

        if (this._max && this._max < intValue) {
            throw new BadRequestException(`${value} is less than ${this._max}`);
        }

        return intValue;
    }
}

@Injectable()
export class MyParseIntPipe implements PipeTransform<string, number> {
    transform(value: string): number {
        const intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
            throw new BadRequestException(`${value} is not a number`);
        }

        return intValue;
    }
}

@Injectable()
export class MyValidationPipe implements PipeTransform<any> {
    constructor(@Inject(ConfigService) private readonly config: IConfigService) {
        appColor('🍺 Global pipe initialized');
    }

    async transform(value: any, { metatype, type }: ArgumentMetadata) {
        if (this.config.get('debug_global_pipe')) {
            logColor(`🐱 [${type.toUpperCase()}]`, value);
        }

        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);

        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
