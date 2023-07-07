import { IsMobilePhone, IsStrongPassword } from 'class-validator';

export class CreateProductDTO {
    @IsMobilePhone('vi-VN')
    mobileNumber: string;

    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    password: string;
}
