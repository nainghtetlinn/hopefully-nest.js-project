import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthConfig } from 'src/config';
import { AuthService } from '../auth.service';
import { JwtVerifiedResult } from '../entities/jwt.entity';
import { LoggedInUser } from '../entities/logged-in-user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    authConfig: AuthConfig,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (req: Request) => req.cookies?.Refresh,
      ]),
      secretOrKey: authConfig.refreshSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtVerifiedResult): LoggedInUser {
    return { userId: payload.userId, email: payload.email };
  }
}
