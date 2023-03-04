import { IsEnum, IsString, IsMongoId } from 'class-validator';
import { GENRES } from '@constant/app.const';

export class CreateMovieDTO {
    @IsString()
    title: string;

    @IsString()
    @IsEnum(GENRES)
    genres: string;

    constructor(partial: Partial<CreateMovieDTO>) {
        Object.assign(this, partial);
    }
}

export class DeleteMovieDTO {
    @IsMongoId()
    _id: string;
}
