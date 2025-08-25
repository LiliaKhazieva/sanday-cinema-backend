import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddCartDto, RemoveFromCartDto, SyncCartDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: string, addToCartDto: AddCartDto) {
    const { productId, quantity, asSecondItem } = addToCartDto;

    let cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          status: 'ACTIVE',
        },
      });
    }
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingCartItem) {
      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
          asSecondItem,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          asSecondItem,
        },
      });
    }
    return this.getCart(userId);
  }

  async getCart(userId: string) {
    return this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        items: { include: { movie: true } },
      },
    });
  }

  async removeFromCart(userId: string, removeFromCartDto: RemoveFromCartDto) {
    const { cartItemId } = removeFromCartDto;
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new Error('Cart item not found or does not belong to user');
    }

    await this.prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return this.getCart(userId);
  }

  async syncCart(userId: string, syncDto: SyncCartDto) {
    const { items } = syncDto;
    let cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId, status: 'ACTIVE' },
      });
    }

    for (const item of items) {
      const productExists = await this.prisma.movie.findUnique({
        where: {
          id: item.movie.id,
        },
      });
      if (!productExists) {
        console.warn(`Product with ID ${item.movie.id} not found, skipping...`);
        continue;
      }

      const existingCartItem = await this.prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId: item.movie.id },
      });

      if (existingCartItem) {
        await this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + item.quantity,
            asSecondItem: item.asSecondItem,
          },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.movie.id,
            quantity: item.quantity,
            asSecondItem: item.asSecondItem,
          },
        });
      }
    }

    return this.getCart(userId);
  }
}
