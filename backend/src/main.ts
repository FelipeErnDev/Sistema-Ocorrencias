import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  Logger,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StatusService } from './status/status.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true }); // lembrar quando subir pra prod mudar isso para os domínios certos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = app.get(ConfigService);

  try {
    const statusSvc = app.get(StatusService);
    await statusSvc.seedDefaults();
  } catch {
    Logger.warn(
      'StatusService not available yet during bootstrap seed.',
      'Bootstrap',
    );
  }
  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  Logger.log(`HTTP server running on http://localhost:${port}`, 'Bootstrap');
}
void bootstrap();
