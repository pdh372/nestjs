import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { SEX } from '@constant/business.const';

@ValidatorConstraint({ name: 'CheckSexValidator', async: true })
@Injectable()
export class IsCustomSex implements ValidatorConstraintInterface {
    async validate(value: string) {
        try {
            const sexObj = Object.fromEntries(Object.values(SEX).map(s => [s, true]));
            return value.split(',').every(v => sexObj[v]);
        } catch (e) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        console.info(args);
        return 'invalid';
    }
}
