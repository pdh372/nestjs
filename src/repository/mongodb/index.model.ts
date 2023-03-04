/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Global, Module } from '@nestjs/common';

// models
import { User, UserModelService, UserModelModule } from './model/user.model';

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

        // If not encrypt anything
        // MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ],
    providers: [MongodbService],
    exports: [MongodbService],
})
export class ModelMongodbModule {}
