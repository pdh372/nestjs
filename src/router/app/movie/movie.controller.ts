import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Query,
    Res,
    ParseArrayPipe,
    Post,
    Body,
    BadRequestException,
    ParseIntPipe,
    ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateMovieDTO } from '@router/app/movie/movie.dto';
import { validate } from 'class-validator';
import { MyParseIntPipeWithCond } from '@src/custom/pipe.custom';

@Controller('movie')
export class MovieController {
    private _movies = [
        { _id: 1, title: 'Ant 1', genres: 'action' },
        { _id: 2, title: 'Ant 2', genres: 'comedy' },
        { _id: 3, title: 'Ant 2', genres: 'comedy' },
        { _id: 4, title: 'Ant 2', genres: 'comedy' },
        { _id: 5, title: 'Ant 2', genres: 'comedy' },
    ];

    @Get()
    getMovies(
        @Query('genres', new ParseArrayPipe({ items: String, separator: ',', optional: true })) genres: string[],
    ) {
        if (!genres) return this._movies;
        const genresObj = Object.fromEntries(genres.map(g => [g, true]));
        const data = this._movies.filter(m => genresObj[m.genres]);
        return data;
    }

    @Get(':id')
    getMovieById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const movie = this._movies.find(m => m._id === id);

        if (!movie) return res.status(HttpStatus.NOT_FOUND).send({ message: 'not_found' });

        return res.status(HttpStatus.OK).send(movie);
    }

    @Get(':id/old-1')
    getMovieByIdOld1(@Param('id', new MyParseIntPipeWithCond()) id: number, @Res() res: Response) {
        const movie = this._movies.find(m => m._id === id);

        if (!movie) return res.status(HttpStatus.NOT_FOUND).send({ message: 'not_found' });

        return res.status(HttpStatus.OK).send(movie);
    }

    @Post()
    createMovie(@Body(new ValidationPipe({ whitelist: true })) data: CreateMovieDTO) {
        const newMovie = { _id: this._movies.length, ...data };
        this._movies.push(newMovie);
        return newMovie;
    }

    @Post('old-1')
    async createMovieOld1(@Body() data: any) {
        const errors = await validate(new CreateMovieDTO(data));
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed');
        }

        const newMovie = { _id: this._movies.length, ...data };
        this._movies.push(newMovie);
        return newMovie;
    }

    @Post('old-2')
    async createMovieOld2(@Body() data: CreateMovieDTO) {
        const newMovie = { _id: this._movies.length, ...data };
        this._movies.push(newMovie);
        return newMovie;
    }

    @Post('old-3')
    // @UsePipes(new MyValidationPipe(CreateMovieDTO))
    async createMovieOld3(@Body() data: CreateMovieDTO) {
        const newMovie = { _id: this._movies.length, ...data };
        this._movies.push(newMovie);
        return newMovie;
    }
}
