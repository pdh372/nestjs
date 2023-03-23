/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, Module } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EncryptService } from '@helper/encrypt.helper';
import { ICreateSchema } from '@interface/mongodb.interface';
import { EncryptModule } from '@helper/encrypt.helper';

@Schema()
export class User extends Document {
    @Prop({ required: true })
    mobileNumber: string;

    @Prop({ required: true })
    password: string;

    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class UserModelService implements ICreateSchema {
    private ENCRYPT_FIELDS = ['mobileNumber'];
    constructor(private readonly encryptService: EncryptService) {}

    createSchema() {
        const { encryptSchema } = this.encryptService;

        const UserSchema = SchemaFactory.createForClass(User).set('timestamps', { createdAt: true, updatedAt: true });

        UserSchema.index({ mobileNumber: 1 }, { unique: true });

        return encryptSchema({ schema: UserSchema, fields: this.ENCRYPT_FIELDS });
    }
}

@Module({
    imports: [EncryptModule],
    providers: [UserModelService],
    exports: [UserModelService],
})
export class UserModelModule {}
