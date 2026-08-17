import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("TaskZen Management")
    .setDescription("TaskZend API Description")
    .setVersion("1.0")
    .addTag("TaskZen")
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/v1/openapi', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
