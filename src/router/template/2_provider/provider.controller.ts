import { MyCustomProvide } from './customProvide.controller';
import { Controller, Get, Inject } from '@nestjs/common';
import { fakeBasicData } from '@helper/fakeData';
import * as INJECT_TOKEN from '@constant/injectionToken.const';
import { ILearnCustomProvide } from '@interface/injectToken.interface';

@Controller({ path: 'provider' })
export class ProviderController {
    private _database = fakeBasicData();

    constructor(
        private MyCustomProvideDefault: MyCustomProvide,
        @Inject(INJECT_TOKEN.IT_LEARN_USE_CLASS) private MyCustomProvideUseClass: MyCustomProvide,
        @Inject(INJECT_TOKEN.IT_LEARN_USE_VALUE) private value: ILearnCustomProvide,
        @Inject(INJECT_TOKEN.IT_LEARN_USE_FUNC) private func: ILearnCustomProvide,
    ) {}

    @Get('use-class/default')
    useClassDefault() {
        return this.MyCustomProvideDefault.log();
    }

    @Get('use-class/inject-token')
    useClassInjectToken() {
        return this.MyCustomProvideUseClass.log();
    }

    @Get('use-value')
    useValue() {
        return this.value;
    }

    @Get('use-func')
    useFunc() {
        return {
            func: this.func,
            val: this.value,
        };
    }
}
