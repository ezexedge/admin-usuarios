import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.use(cookieParser());
  app.enableCors(
    {
      origin: 'http://localhost:4200',
      credentials: true
    }
  )
  app.useGlobalPipes(new ValidationPipe())

  const options = new DocumentBuilder()
  .setTitle('prueba')
  .setDescription(`The prueba} API description`)
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
