import { NestFactory } from '@nestjs/core';
import { AppModule } from './auth.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
