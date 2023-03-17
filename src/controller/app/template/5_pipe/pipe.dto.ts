import { IsNumber } from 'class-validator';

export class TestDTO {
    @IsNumber()
    age: number;
}
