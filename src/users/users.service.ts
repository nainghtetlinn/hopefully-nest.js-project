import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneByEmailAndOmitPassword(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      omit: { password: true },
    });
  }
}
