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

    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class UserModelService implements ICreateSchema {
    private ENCRYPT_FIELDS = ['mobileNumber'];
    constructor(private readonly encryptService: EncryptService) {}

    createSchema() {
        const ENCRYPT_FIELDS = this.ENCRYPT_FIELDS;
        const { encryptModel, decryptFields, decryptModel } = this.encryptService;

        const UserSchema = SchemaFactory.createForClass(User).set('timestamps', { createdAt: true, updatedAt: true });

        UserSchema.index({ mobileNumber: 1 }, { unique: true });

        // @ts-ignore
        UserSchema.pre(['find', 'findOne', 'countDocuments', 'exists'], function () {
            ENCRYPT_FIELDS.forEach(field => {
                // @ts-ignore
                if (this._conditions[field]) this._conditions[field] = encryptModel(this._conditions[field]);
            });
        });

        // @ts-ignore
        UserSchema.pre('save', function () {
            ENCRYPT_FIELDS.forEach(field => {
                // @ts-ignore
                if (this[field]) this[field] = encryptModel(this[field]);
            });
        });

        // @ts-ignore
        UserSchema.post('save', function () {
            ENCRYPT_FIELDS.forEach(field => {
                // @ts-ignore
                if (this && this[field]) this[field] = decryptModel(this[field]);
            });
        });
        // @ts-ignore
        UserSchema.post('findById', decryptFields(ENCRYPT_FIELDS));
        UserSchema.post('findOne', decryptFields(ENCRYPT_FIELDS));
        UserSchema.post(['find'], function (result) {
            result.map(decryptFields(ENCRYPT_FIELDS));
        });

        return UserSchema;
    }
}

@Module({
    imports: [EncryptModule],
    providers: [UserModelService],
    exports: [UserModelService],
})
export class UserModelModule {}
