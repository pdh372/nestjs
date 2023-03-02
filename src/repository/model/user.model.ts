/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { decryptFields, encryptModel, decryptModel } from '@helper/encryption';

const ENCRYPT_FIELDS = ['mobileNumber'];

@Schema()
export class User extends Document {
    @Prop({ required: true })
    mobileNumber: string;

    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User)
    .set('versionKey', false)
    .set('timestamps', { createdAt: true, updatedAt: true });

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
