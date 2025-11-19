import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.findOneByEmail(registerDto.email);
    if (user) throw new BadRequestException('User already exists');
    registerDto.password = await this.hashPassword(registerDto.password);

    const newUser = await this.prisma.user.create({
      data: registerDto,
      omit: { password: true },
    });
    const payload = { sub: newUser.id, email: newUser.email };
    return {
      ...newUser,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) throw new NotFoundException('User not found');

    const match = await this.comparePassword(loginDto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    const payload = { sub: result.id, email: result.email };
    return {
      ...result,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async getMe(email: string) {
    const user = await this.usersService.findOneByEmailAndOmitPassword(email);
    return user;
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
