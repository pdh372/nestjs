import { Module } from '@nestjs/common';
import { MovieController } from '@router/app/movie/movie.controller';

@Module({
    controllers: [MovieController],
})
export class MovieModule {}
