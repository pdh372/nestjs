import { Module } from '@nestjs/common';
import { ProviderController } from '@router/template/2_provider/provider.controller';
import * as INJECT_TOKEN from '@constant/injectionToken.const';
import { MyCustomProvide } from '@router/template/2_provider/customProvide.controller';
import { MY_CUSTOM } from '@constant/useValue.const';
import { ILearnCustomProvide } from '@interface/injectToken.interface';

@Module({
    controllers: [ProviderController],
    providers: [
        // use value
        {
            provide: INJECT_TOKEN.IT_LEARN_USE_VALUE,
            useValue: { ...MY_CUSTOM, databaseUrl: new MyCustomProvide().getDatabaseURL() },
        },
        // use class
        {
            provide: INJECT_TOKEN.IT_LEARN_USE_CLASS,
            useClass: MyCustomProvide,
        },
        {
            provide: MyCustomProvide,
            useClass: MyCustomProvide,
        },
        // use func
        {
            provide: INJECT_TOKEN.IT_LEARN_USE_FUNC,
            useFactory: function (param1: MyCustomProvide): ILearnCustomProvide {
                return { ...MY_CUSTOM, databaseUrl: param1.getDatabaseURL() };
            },
            inject: [MyCustomProvide],
        },
    ],
})
export class ProviderModule {}

// providers: [
//     {
//         provide: MyCustomProvide,
//         useClass: MyCustomProvide,
//     },
// ],

// ~~ TƯƠNG ĐƯƠNG

// providers: [
//    MyCustomProvide
// ],
