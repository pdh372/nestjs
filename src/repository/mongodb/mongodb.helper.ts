import { ModelDefinition } from '@nestjs/mongoose';
import { IAsyncModelFactory } from '@interface/mongodb.interface';

import { User, UserModelService, UserModelModule } from './model/user.model';
import { Movie, MovieSchema } from './model/movie.model';

export const factories: IAsyncModelFactory[] = [
    {
        imports: [UserModelModule],
        name: User.name,
        useFactory: userModelService => {
            return userModelService.createSchema();
        },
        inject: [UserModelService],
    },
];

export const models: ModelDefinition[] = [{ name: Movie.name, schema: MovieSchema }];
