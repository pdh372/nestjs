import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
    @Prop({ required: true })
    title: string;

    createdAt: Date;
    updatedAt: Date;
}

export const MovieSchema = SchemaFactory.createForClass(Movie)
    .set('versionKey', false)
    .set('timestamps', { createdAt: true, updatedAt: true });
