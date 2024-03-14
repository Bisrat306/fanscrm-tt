import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config(); // Load environment variables from .env file
  setupSwagger(app); // Configuers Swagger
  await app.listen(3000);
}
bootstrap();
