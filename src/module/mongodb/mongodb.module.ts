/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MongodbService } from '@module/mongodb/mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Global, Module } from '@nestjs/common';
import { factories, models } from '@module/mongodb/mongodb.helper';

@Global()
@Module({
    imports: [
        // If want handle middleware in mongoose, here how to handle it
        MongooseModule.forFeatureAsync(factories),

        // If don't do anything
        MongooseModule.forFeature(models),
    ],
    providers: [MongodbService],
    exports: [MongodbService],
})
export class MongodbModule {}
