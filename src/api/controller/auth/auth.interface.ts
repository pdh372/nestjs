import { JwtModuleOptions } from '@nestjs/jwt';
export interface IUserVerified {
    _id: string;
}

export type TRoleSign = JwtModuleOptions & { provide: symbol };
