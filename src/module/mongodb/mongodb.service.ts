/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common';
import { appColor } from '@helper/chalk.helper';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// models
import { Movie } from '@module/mongodb/model/movie.model';
import { ErrorLog } from '@module/mongodb/model/errorLog.model';
import { User } from './model/user.model';

@Injectable()
export class MongodbService {
    constructor(
        @Inject(ConfigService) private configService: IConfigService,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
        @InjectModel(ErrorLog.name) private readonly errorLogModel: Model<ErrorLog>,
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

    get ErrorLog() {
        return this.errorLogModel;
    }
}
