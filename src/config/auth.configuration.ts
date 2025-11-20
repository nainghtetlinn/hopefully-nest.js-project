import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Configuration()
export class AuthConfig {
  @IsNotEmpty()
  @Value('JWT_ACCESS_TOKEN_SECRET')
  accessSecret: string;

  @IsNotEmpty()
  @IsNumber()
  @Value('JWT_ACCESS_TOKEN_EXPIRES_IN', {
    parse: parseInt,
  })
  accessExpiresIn: number;

  @IsNotEmpty()
  @Value('JWT_REFRESH_TOKEN_SECRET')
  refreshSecret: string;

  @IsNotEmpty()
  @IsNumber()
  @Value('JWT_REFRESH_TOKEN_EXPIRES_IN', {
    parse: parseInt,
  })
  refreshExpiresIn: number;
}
