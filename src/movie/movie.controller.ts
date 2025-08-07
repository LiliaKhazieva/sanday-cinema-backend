import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { GetAllMovieDto } from './dto/movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() query: GetAllMovieDto) {
    return this.movieService.getAll(query);
  }
}
