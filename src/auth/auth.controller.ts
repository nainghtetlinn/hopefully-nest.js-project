import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request, type Response } from 'express';

import { AppConfig } from 'src/config';
import { Public } from 'src/decorators/public.decorator';
import { GetLoggedInUser } from 'src/decorators/user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtPayload } from './entities/jwt.entity';
import { type LoggedInUser } from './entities/logged-in-user.entity';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private appConfig: AppConfig,
  ) {}

  @ApiOperation({ summary: 'Register user' })
  @Public()
  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() registerDto: RegisterDto,
  ) {
    const user = await this.authService.register(registerDto);
    const payload: JwtPayload = { userId: user.id, email: user.email };
    await this.setCookies(payload, response);
    return user;
  }

  @ApiOperation({ summary: 'Login user' })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ) {
    const user = await this.authService.validateUser(loginDto);
    const payload: JwtPayload = { userId: user.id, email: user.email };
    await this.setCookies(payload, response);
    return user;
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @GetLoggedInUser() loggedInUser: LoggedInUser,
  ) {
    const user = await this.authService.veryifyRefreshToken(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      request.cookies.Refresh,
      loggedInUser.userId,
    );
    const payload: JwtPayload = { userId: user.id, email: user.email };
    await this.setCookies(payload, response);
    return 'success';
  }

  @ApiOperation({ summary: 'Get profile' })
  @Get('me')
  getMe(@GetLoggedInUser() user: LoggedInUser) {
    return this.authService.getMe(user.email);
  }

  private async setCookies(payload: JwtPayload, response: Response) {
    const {
      accessToken,
      expiresAccessToken,
      refreshToken,
      expiresRefreshToken,
    } = await this.authService.generateTokens(payload);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: !this.appConfig.isDev,
      expires: expiresAccessToken,
    });
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: !this.appConfig.isDev,
      expires: expiresRefreshToken,
    });
  }
}
