import { InjectionToken } from '@nestjs/common';

// provider.module.ts
export const IT_LEARN_USE_VALUE: InjectionToken = Symbol('key_of_use_value_1');
export const IT_LEARN_USE_CLASS: InjectionToken = Symbol('key_of_use_class');
export const IT_LEARN_USE_FUNC: InjectionToken = Symbol('key_of_use_function');
export const IT_LEARN_USE_VALUE2: InjectionToken = Symbol('key_of_use_value_2');

// My Dynamic Module
export const IT_DYNAMIC_MODULE_INPUT: InjectionToken = Symbol('dynamic_module_dirname');
export const IT_DYNAMIC_MODULE_FILENAME = (filename: string): InjectionToken => {
    return 'dynamic_module_filename' + filename;
};
