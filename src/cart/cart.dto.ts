import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddCartDto {
  @IsString()
  @IsNotEmpty()
  readonly productId: string;

  @IsInt()
  @Type(() => Number)
  readonly quantity: number;

  @IsBoolean()
  @IsOptional()
  readonly asSecondItem?: boolean;
}

export class RemoveFromCartDto {
  @IsString()
  @IsNotEmpty()
  readonly cartItemId: string;
}

export interface SyncCartDto {
  items: {
    movie: {
      id: string;
    };
    quantity: number;
    asSecondItem?: boolean;
  }[];
}
