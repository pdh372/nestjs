/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IConfigService } from '@interface/config.interface';
import { Inject, Injectable } from '@nestjs/common';
import { appColor } from '@helper/chalk.helper';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// models
import { User } from '@repository/mongodb/model/user.model';
import { Movie } from '@repository/mongodb/model/movie.model';

@Injectable()
export class ModelService {
    constructor(
        @Inject(ConfigService) private configService: IConfigService,
        // @ts-ignore
        @InjectModel(User.name) private readonly userModel: Model<User>,

        // @ts-ignore
        @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    ) {
        if (this.configService.get('debug_mongoose_model')) {
            setTimeout(() => {
                // eslint-disable-next-line prefer-rest-params
                const models = Object.values(arguments).filter(m => m.modelName);
                appColor(`🚀 Creating Models ..............................`);
                models.map((m: any, index: number) => {
                    appColor(`🚀 ${index + 1}: ${m.modelName}`);
                });
                appColor(`🚀 Created: ${models.length} Models`);
            });
        }
    }

    get User() {
        return this.userModel;
    }

    get Movie() {
        return this.movieModel;
    }
}
