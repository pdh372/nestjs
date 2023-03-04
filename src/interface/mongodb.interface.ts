import * as mongoose from 'mongoose';
export interface ICreateSchema {
    createSchema(): mongoose.Schema;
}
