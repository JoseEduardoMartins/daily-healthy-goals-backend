import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Daily Healthy Goals API')
    .setDescription('API para sistema de gestão de metas diárias de saúde')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação de usuários')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('pain-states', 'Estados de dor/humor')
    .addTag('categories', 'Categorias de produtos e exercícios')
    .addTag('products', 'Produtos (comidas/bebidas)')
    .addTag('exercises', 'Exercícios')
    .addTag('daily-checkins', 'Check-ins diários')
    .addTag('daily-goals', 'Metas diárias do usuário')
    .addTag('user-types', 'Tipos de usuário')
    .addTag('plans', 'Planos de assinatura')
    .addTag('users', 'Gerenciamento de usuários')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api`);
}
bootstrap();
