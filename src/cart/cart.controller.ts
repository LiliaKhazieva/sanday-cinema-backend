import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AddCartDto, RemoveFromCartDto } from './cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @Auth()
  async addToCart(
    @CurrentUser('id') userId: string,
    @Body() addToCartDto: AddCartDto,
  ) {
    return await this.cartService.addToCart(userId, addToCartDto);
  }

  @Get()
  @Auth()
  async getCart(@CurrentUser('id') userId: string) {
    return await this.cartService.getCart(userId);
  }

  @Delete()
  @Auth()
  async removeFromCart(
    @CurrentUser('id') userId: string,
    @Body() removeFromCartDto: RemoveFromCartDto,
  ) {
    return await this.cartService.removeFromCart(userId, removeFromCartDto);
  }
}
