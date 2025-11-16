import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = { userId: number; email: string }>(
    err: any,
    user: TUser | null,
  ): TUser {
    if (err || !user)
      throw new UnauthorizedException('Invalid or expired token');
    return user;
  }
}
