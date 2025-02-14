import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: "*"
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    }))
    app.enableCors({
      origin: 'http://localhost:3001', // URL frontend
      methods: 'GET,POST,PUT,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
    });

  const config = new DocumentBuilder()
    .setTitle('LAB BACKEND')
    .setDescription('YOGI A.AMMAH')
    .setVersion('0.1')
    .addTag('Kelas C')
    .addBearerAuth()
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api-docs', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();