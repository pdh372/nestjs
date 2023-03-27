import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

interface IValidateBody<T extends ClassConstructor<any>> {
    classDTO: T;
    data: any;
}

export const validateBody = async <T extends ClassConstructor<any>>(param: IValidateBody<T>): Promise<string[]> => {
    const { classDTO, data } = param;
    const body = plainToInstance(classDTO, data);

    let errors: any[] = await validate(body, { skipMissingProperties: false });
    if (errors.length > 0) {
        errors = errors.map(e => Object.values(e.constraints)).flat();
    }

    return errors;
};
