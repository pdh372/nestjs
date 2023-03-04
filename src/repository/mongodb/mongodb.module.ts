/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ModelService } from '@repository/mongodb/mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Global, Module } from '@nestjs/common';

// models
import { User, UserModelService, UserModelModule } from './model/user.model';
import { Movie, MovieSchema } from './model/movie.model';

@Global()
@Module({
    imports: [
        // import models here:

        // If want handle middleware in mongoose, here how to handle it
        MongooseModule.forFeatureAsync([
            {
                imports: [UserModelModule],
                name: User.name,
                useFactory: (userModelService: UserModelService) => {
                    return userModelService.createSchema();
                },
                inject: [UserModelService],
            },
        ]),

        // If don't do anything
        MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    ],
    providers: [ModelService],
    exports: [ModelService],
})
export class ModelModule {}
