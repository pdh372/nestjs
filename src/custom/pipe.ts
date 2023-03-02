/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, PipeTransform, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { ClassConstructor, plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
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
    constructor(private className?: ClassConstructor<any>) {}

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = this.className ? plainToClass(this.className, value) : plainToInstance(metatype, value);

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
