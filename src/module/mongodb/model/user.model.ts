/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, Module } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EncryptService } from '@helper/encrypt.helper';
import { ICreateSchema } from '../mongodb.interface';
import { EncryptModule } from '@helper/encrypt.helper';

@Schema()
export class User extends Document {
    _id: Types.ObjectId;

    @Prop({ required: true })
    password: string;

    @Prop({ type: Object })
    secretMetadata: any;

    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class UserModelService implements ICreateSchema {
    private ENCRYPT_FIELDS = ['account'];
    constructor(private readonly encryptService: EncryptService) {}

    createSchema() {
        const { encryptSchema } = this.encryptService;

        const UserSchema = SchemaFactory.createForClass(User)
            .set('collection', 'users')
            .set('timestamps', { createdAt: true, updatedAt: true });

        return encryptSchema({ schema: UserSchema, fields: this.ENCRYPT_FIELDS });
    }
}

@Module({
    imports: [EncryptModule],
    providers: [UserModelService],
    exports: [UserModelService],
})
export class UserModelModule {}
