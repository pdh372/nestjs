/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '@repository/mongodb/model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { appColor } from '@helper/chalk';
import { IConfigService } from '@interface/config.interface';

@Injectable()
export class MongodbService {
    constructor(
        @Inject(ConfigService) private config: IConfigService,
        // @ts-ignore
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {
        if (this.config.get('debug_mongoose_model')) {
            setTimeout(() => {
                appColor('🚀 Model Created:');
                // eslint-disable-next-line prefer-rest-params
                Object.values(arguments)
                    .filter(m => m.modelName)
                    .map((a: any, index: number) => {
                        appColor(`🚀 ${index + 1}: ` + a.modelName);
                    });
            });
        }
    }

    get User() {
        return this.userModel;
    }
}
