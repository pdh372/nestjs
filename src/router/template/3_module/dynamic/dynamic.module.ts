import { DynamicModule, Inject, Injectable, Module, Optional } from '@nestjs/common';
import * as path from 'path';
import * as INJECT_TOKEN from 'src/constant/injectionToken.const';

@Injectable()
export class MyDynamicService {
    constructor(@Optional() @Inject(INJECT_TOKEN.IT_DYNAMIC_MODULE_INPUT) private data: any) {
        console.log('create dir and folder', data.dirname, data.filename);
    }

    writeData(data: any) {
        console.log(`wrote in ${this.data.dirname}/${this.data.filename} data =`, data);
    }
}

let StoreGlobal: any = {};

@Module({})
export class MyDynamicModule {
    static forRoot(dir?: string): DynamicModule {
        StoreGlobal = this.buildStoreOptions(undefined, dir);
        return {
            module: MyDynamicModule,
            providers: [
                {
                    provide: INJECT_TOKEN.IT_DYNAMIC_MODULE_INPUT,
                    useValue: StoreGlobal,
                },
                MyDynamicService,
            ],
        };
    }

    static forFeature(filename: string): DynamicModule {
        const token = INJECT_TOKEN.IT_DYNAMIC_MODULE_FILENAME(filename);
        return {
            module: MyDynamicModule,
            providers: [
                {
                    provide: token,
                    useFactory: () => {
                        return new MyDynamicService(this.buildStoreOptions(filename, StoreGlobal.dirname));
                    },
                },
            ],
            exports: [token],
        };
    }

    private static buildStoreOptions(filename?: string, dir?: string) {
        return {
            dirname: dir || path.join(__dirname + `../../../../../../store`),
            filename: filename || 'default',
        };
    }
}
