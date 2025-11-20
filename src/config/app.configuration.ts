import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class AppConfig {
  @Value('NODE_ENV', {
    default: 'development',
    parse: (val) => val === 'development',
  })
  isDev: boolean;
}
