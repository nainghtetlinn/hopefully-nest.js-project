import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthConfig } from 'src/config';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtPayload } from './entities/jwt.entity';

@Injectable()
export class AuthService {
  constructor(
    private authConfig: AuthConfig,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.findByEmail(registerDto.email);
    if (user) throw new BadRequestException('User already exists');
    registerDto.password = await this.hashPassword(registerDto.password);

    const newUser = await this.prisma.user.create({
      data: registerDto,
      omit: { password: true, refreshToken: true },
    });

    return newUser;
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new NotFoundException('User not found');

    const match = await this.comparePassword(loginDto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...result } = user;
    return result;
  }

  async veryifyRefreshToken(token: string, userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const match = await this.comparePassword(token, user.refreshToken || '');
    if (!match) throw new UnauthorizedException('Invalid refresh token');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...result } = user;
    return result;
  }

  async refreshToken() {
    const user = await this.usersService.findById(1);
    if (!user) throw new NotFoundException('User not found');
  }

  async getMe(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: { password: true, refreshToken: true },
    });
    return user;
  }

  /**
   *
   * Utils
   *
   */
  async generateTokens(payload: JwtPayload) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setTime(
      expiresAccessToken.getTime() + this.authConfig.accessExpiresIn,
    );
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.authConfig.accessSecret,
      expiresIn: this.authConfig.accessExpiresIn,
    });

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setTime(
      expiresRefreshToken.getTime() + this.authConfig.refreshExpiresIn,
    );
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.authConfig.refreshSecret,
      expiresIn: this.authConfig.refreshExpiresIn,
    });
    await this.prisma.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        refreshToken: await this.hashPassword(refreshToken),
      },
    });
    return {
      accessToken,
      expiresAccessToken,
      refreshToken,
      expiresRefreshToken,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
