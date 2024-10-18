import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtJwtGuard } from './auth/guard';
import * as fs from 'fs'

const httpsOptions ={
  key: fs.readFileSync('./secrets/cert.key'),
  cert: fs.readFileSync('./secrets/cert.crt')
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {httpsOptions});
  app.useGlobalPipes(new ValidationPipe());
  //app.useGlobalGuards(new AtJwtGuard);
  app.enableCors();
  await app.listen(5000);
}
bootstrap();
