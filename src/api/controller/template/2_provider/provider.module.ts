import { Module } from '@nestjs/common';
import { ProviderController } from '@src/api/controller/template/2_provider/provider.controller';
import * as INJECT_TOKEN from '@constant/injectionToken.const';
import { MyCustomProvide } from '@src/api/controller/template/2_provider/customProvide.controller';
import { ILearnCustomProvide } from '@interface/useProvider.interface';

const MY_CUSTOM: ILearnCustomProvide = {
    admin: 'admin@gmail',
    password: '123456',
    databaseUrl: '',
};

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
