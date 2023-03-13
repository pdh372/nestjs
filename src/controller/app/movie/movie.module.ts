import { Module } from '@nestjs/common';
import { MovieController } from '@src/controller/app/movie/movie.controller';

@Module({
    controllers: [MovieController],
})
export class MovieModule {}
