import { ModelDefinition } from '@nestjs/mongoose';
import { IAsyncModelFactory } from './mongodb.interface';

import { UserModelService, UserModelModule } from '@model/user.model';
import { ErrorLog, ErrorLogSchema } from '@model/errorLog.model';

export const factories: IAsyncModelFactory[] = [
    {
        imports: [UserModelModule],
        name: 'User',
        useFactory: userModelService => {
            return userModelService.createSchema();
        },
        inject: [UserModelService],
    },
];

export const models: ModelDefinition[] = [{ name: ErrorLog.name, schema: ErrorLogSchema }];
