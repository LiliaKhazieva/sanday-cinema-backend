import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('auth/login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('auth/register')
  async register(
    @Body() dto: RegisterDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @HttpCode(200)
  @Post('auth/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.refreshTokenService.REFRESH_TOKEN_NAME];
    if (!refreshTokenFromCookies) {
      this.refreshTokenService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('Refresh token not passed');
    }
    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookies,
    );
    this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @HttpCode(200)
  @Post('auth/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.refreshTokenService.removeRefreshTokenFromResponse(res);
    return true;
  }
}
