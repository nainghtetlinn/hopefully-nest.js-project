import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { loginSchema, type LoginDto } from './dto/login.dto';
import { registerSchema, type RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  getMe(@Req() req: Request) {
    const { email } = req.user as { userId: number; email: string };
    return this.authService.getMe(email);
  }
}
