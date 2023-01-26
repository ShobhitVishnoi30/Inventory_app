import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { ValidationPipe } from '@nestjs/common/pipes';
dotenv.config();

let PORT: number = Number(process.env.PORT);
if (!PORT) {
  PORT = 3000;
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );
  await app.listen(PORT);
}
bootstrap();
