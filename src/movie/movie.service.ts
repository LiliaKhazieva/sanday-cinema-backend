import { Injectable } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { EnumMovieSort, GetAllMovieDto } from './dto/movie.dto';
import { AgeRating, Genre, Prisma } from '@prisma/client';
import { convertToNumber } from 'src/utils/convert-to-numbers';

@Injectable()
export class MovieService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async getAll(dto: GetAllMovieDto = {}) {
    const { perPage, skip } = this.paginationService.getPagination(dto);
    const filters = this.createFilter(dto);
    const movies = await this.prisma.movie.findMany({
      where: filters,
      orderBy: this._getSortOption(dto.sort),
      skip,
      take: perPage,
    });
    return {
      movies,
      length: await this.prisma.movie.count({
        where: filters,
      }),
    };
  }

  private createFilter(dto: GetAllMovieDto): Prisma.MovieWhereInput {
    const filters: Prisma.MovieWhereInput[] = [];
    if (dto.searchTerm) filters.push(this._getSearchTermFilter(dto.searchTerm));
    if (dto.rating) filters.push(this._getRatingFilter(+dto.rating));
    if (dto.minPrice || dto.maxPrice)
      filters.push(
        this._getPriceFilter(
          convertToNumber(dto.minPrice),
          convertToNumber(dto.maxPrice),
        ),
      );
    if (dto.genres) filters.push(this._getGenreFilter(dto.genres));

    if (dto.isAdultOnly !== undefined)
      filters.push(this._getAdultOnlyFilter(dto.isAdultOnly));

    return filters.length ? { AND: filters } : {};
  }
  private _getSortOption(
    sort: EnumMovieSort,
  ): Prisma.MovieOrderByWithRelationInput[] {
    switch (sort) {
      case EnumMovieSort.LOW_PRICE:
        return [{ price: 'asc' }];
      case EnumMovieSort.HIGH_PRICE:
        return [{ price: 'desc' }];
      case EnumMovieSort.OLDEST:
        return [{ releaseDate: 'asc' }];
      default:
        return [{ releaseDate: 'desc' }];
    }
  }
  private _getSearchTermFilter(searchTerm: string): Prisma.MovieWhereInput {
    return {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          publisher: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          developer: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  private _getRatingFilter(rating: number): Prisma.MovieWhereInput {
    return {
      rating: {
        gte: rating, // больше либо равно
      },
    };
  }

  private _getPriceFilter(
    minPrice?: number,
    maxPrice?: number,
  ): Prisma.MovieWhereInput {
    let priceFilter: Prisma.NestedFloatFilter | undefined = undefined;
    if (minPrice) {
      priceFilter = {
        ...priceFilter,
        gte: minPrice,
      };
    }
    if (maxPrice) {
      priceFilter = {
        ...priceFilter,
        lte: maxPrice,
      };
    }
    return {
      price: priceFilter,
    };
  }
  private _getGenreFilter(genres: string): Prisma.MovieWhereInput {
    const genresArray = genres.split('|') as Genre[];
    return {
      genres: {
        hasEvery: genresArray, // имеет каждый
      },
    };
  }

  private _getAdultOnlyFilter(
    isAdultOnlyProps: string,
  ): Prisma.MovieWhereInput {
    const isAdultOnly = isAdultOnlyProps === 'true';
    return {
      ageRating: {
        in: isAdultOnly
          ? [AgeRating.AO, AgeRating.E, AgeRating.T]
          : [AgeRating.E, AgeRating.T],
      },
    };
  }
}
