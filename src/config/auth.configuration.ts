import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty } from 'class-validator';

@Configuration()
export class AuthConfig {
  @IsNotEmpty()
  @Value('JWT_SECRET')
  secret: string;

  @IsNotEmpty()
  @Value('JWT_EXPIRES_IN')
  expiresIn: string;
}
