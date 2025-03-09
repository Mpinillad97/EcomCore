import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new loggerGlobal().use);
  app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder()
                          .setTitle('Ecommerce API M4')
                          .setDescription('API Documentation for module 4')
                          .setVersion('1.0.0')
                          .addBearerAuth()
                          .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
