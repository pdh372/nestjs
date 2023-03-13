// DEFAULT - SETUP
import * as mongoose from 'mongoose';
export interface ICreateSchema {
    createSchema(): mongoose.Schema;
}

export interface IAsyncModelFactory {
    imports: any[];
    name: string;
    useFactory: (modelService: ICreateSchema) => mongoose.Schema;
    inject: any[];
}

// APP
