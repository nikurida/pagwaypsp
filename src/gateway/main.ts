import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const config = new DocumentBuilder()
    .setTitle('Pagway API')
    .setDescription(
      'Pagway API - Com ferramentas disponíveis somente em ambiente de desenvolvimento',
    )
    .addApiKey({ name: 'X-API-KEY', type: 'apiKey' })
    .setVersion('1.0')
    .addTag('Transactions')
    .addTag('Payables')
    .addTag('Balance')
    .addApiKey({ type: 'apiKey', name: 'X-API-KEY' })
    .addBearerAuth({ type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
