import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Nest.js testing')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('nest')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    customCss: `
    /* Make the container a grid */
    .opblock-body {
      display: grid !important;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }

    /* Request section (left) */
    .opblock-section {
      order: 2;
    }

    /* Execute button wrapper — keep it under request */
    .execute-wrapper, .btn-group {
      order: 1;
      grid-column: span 2;
    }

    .loading-container {
      display: none !important
    }

    /* Responses section (right side) */
    .responses-wrapper {
      order: 2;
    }
  `,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
