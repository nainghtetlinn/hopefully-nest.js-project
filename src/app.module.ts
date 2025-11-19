import { ConfigifyModule } from '@itgorillaz/configify';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './db/prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';

import { logger } from './common/middlewares';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    PrismaModule,
    AuthModule,
    UsersModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes('*');
  }
}
