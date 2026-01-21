import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthConfig } from 'src/config';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (authConfig: AuthConfig) => ({
        secret: authConfig.accessSecret,
      }),
      inject: [AuthConfig],
    }),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
