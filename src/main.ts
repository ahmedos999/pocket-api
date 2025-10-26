import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validate } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{bufferLogs:true});

  app.enableCors()
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true
    })
  )
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
