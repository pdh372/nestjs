import { PickType } from '@nestjs/swagger';
import { IsMobilePhone, IsStrongPassword } from 'class-validator';

export class UserSignUpDTO {
    @IsMobilePhone('vi-VN')
    mobileNumber: string;

    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    password: string;
}

export class UserLoginDTO extends PickType(UserSignUpDTO, ['mobileNumber', 'password']) {}
