import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { collectDefaultMetrics, register } from 'prom-client';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    logger: false,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const config = new DocumentBuilder()
    .setTitle('Pagway API')
    .setDescription(
      'Pagway API - Com ferramentas disponíveis somente em ambiente de desenvolvimento',
    )
    .setVersion('1.0')
    .addTag('Transactions')
    .addTag('Users')
    .addTag('Balance')
    .addTag('Customers')
    .addBearerAuth({ type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  collectDefaultMetrics({
    prefix: 'gateway_',
  });

  app.getHttpAdapter().get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
  });

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
