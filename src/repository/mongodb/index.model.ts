/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { Global, Module } from '@nestjs/common';

// models
import { User, UserSchema } from './model/user.model';

@Global()
@Module({
    imports: [
        // import models here:
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [MongodbService],
    exports: [MongodbService],
})
export class ModelMongodbModule {}
