import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strip unknown fields
      forbidNonWhitelisted: true, // error on extra fields
      transform: true,            // auto-transform payloads
    }),
  );

  await app.listen(3000);
}
bootstrap();
