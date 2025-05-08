import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Obter o serviço de configuração
  const configService = app.get(ConfigService);
  
  // Configurar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Configurar CORS
  app.enableCors();
  
  // Configurar prefixo global da API
  const apiPrefix = configService.get('API_PREFIX', '/api');
  app.setGlobalPrefix(apiPrefix);
  
  // Obter a porta da API
  const port = configService.get('API_PORT', 3000);
  
  await app.listen(port);
  console.log(`Aplicação rodando na porta ${port}`);
}
bootstrap();