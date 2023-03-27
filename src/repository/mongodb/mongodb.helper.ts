import { ModelDefinition } from '@nestjs/mongoose';
import { IAsyncModelFactory } from '@interface/mongodb.interface';

import { UserModelService, UserModelModule } from './model/user.model';
import { Movie, MovieSchema } from './model/movie.model';
import { ErrorLog, ErrorLogSchema } from '@repository/mongodb/model/errorLog.model';

export const factories: IAsyncModelFactory[] = [
    {
        imports: [UserModelModule],
        name: 'User',
        useFactory: userModelService => {
            return userModelService.createSchema();
        },
        inject: [UserModelService],
    },
];

export const models: ModelDefinition[] = [
    { name: Movie.name, schema: MovieSchema },
    { name: ErrorLog.name, schema: ErrorLogSchema },
];
