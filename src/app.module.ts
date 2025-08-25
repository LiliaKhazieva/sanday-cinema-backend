import { Module } from '@nestjs/common';

import { MovieModule } from './movie/movie.module';
import { PaginationModule } from './pagination/pagination.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import { path } from 'app-root-path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
    MovieModule,
    PaginationModule,
    AuthModule,
    UserModule,
    CartModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
