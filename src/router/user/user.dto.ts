import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { IsCustomSex } from '@custom/classValidator';
import { SEX } from '@constant/app.const';

export class CreateUserDTO {
    @IsString({ always: false })
    name: string;

    @IsEnum(SEX)
    sex: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export class GetUserWithFilterDTO {
    @Validate(IsCustomSex)
    @IsOptional()
    sex: string;
}
