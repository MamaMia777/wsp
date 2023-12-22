import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  const corsOptions: CorsOptions = {
    origin: ['http://localhost:3000', 'https://wsp.company'], // Update with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  };
  app.enableCors(corsOptions);
  app.use(cookieParser('WSP_SECRET'));
  await app.listen(3001);
}
bootstrap();
