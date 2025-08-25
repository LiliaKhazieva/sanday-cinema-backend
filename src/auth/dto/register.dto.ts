import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AuthDto } from './auth.dto';

class CartProductItemDto {
  @IsString()
  id: string;
}

class CartItemDto {
  movie: CartProductItemDto;
  @IsNumber()
  quantity: number;
}

export class RegisterDto extends AuthDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cartItems?: CartItemDto[];
}
