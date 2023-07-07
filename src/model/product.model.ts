import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: Date })
    createdAt: Date;
    @Prop({ type: Date })
    updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product)
    .set('versionKey', false)
    .set('timestamps', { createdAt: true, updatedAt: true });
