import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ErrorLog extends Document {
    @Prop({ type: String, required: true })
    path: string;

    @Prop({ type: String, required: true })
    method: string;

    @Prop({ type: Object, required: true })
    errorDetail: Record<string, any>;

    @Prop({ type: Object })
    metadata: {
        query: Record<string, any>;
        params: Record<string, any>;
        body: Record<string, any>;
        user: Record<string, any>;
    };

    createdAt: Date;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog)
    .set('versionKey', false)
    .set('timestamps', { createdAt: true, updatedAt: false });
