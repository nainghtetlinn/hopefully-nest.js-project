import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty } from 'class-validator';

@Configuration()
export class DatabaseConfig {
  @IsNotEmpty()
  @Value('DATABASE_URL')
  url: string;
}
