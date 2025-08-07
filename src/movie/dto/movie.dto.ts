import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/pagination/pagination.dto';

export enum EnumMovieSort {
  LOW_PRICE = 'LOW_PRICE',
  HIGH_PRICE = 'HIGH_RPICE',
  OLDEST = 'OLDEST',
  NEWEST = 'NEWEST',
}

export class GetAllMovieDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EnumMovieSort)
  sort?: EnumMovieSort;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsString()
  genres?: string;

  @IsOptional()
  @IsString()
  rating?: string;

  @IsOptional()
  @IsString()
  minPrice?: string;

  @IsOptional()
  @IsString()
  maxPrice?: string;

  @IsOptional()
  @IsString()
  isAdultOnly?: string;
}
