import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import CORS_SITE from './config/cros';
import { LogService } from './utils/log-provider/log.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LogService(),
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(CORS_SITE);

  const options = new DocumentBuilder()
    .setTitle('Oraichain Orderbook API Service Documents')
    .setDescription('API Documents')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  !config.isProd && SwaggerModule.setup('docs', app, document);

  await app.listen(config.PORT, () => {
    console.info(`--- 🚀 Server running on ${config.PORT} ---`);
  });
}
bootstrap();
