import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const helmet = require('helmet');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const compression = require('compression');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser');
import { AppModule } from './app.module';
import { getCorsOrigins } from './common/utils/cors-origin.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const corsOrigins = getCorsOrigins(configService);

  // Render (and most PaaS hosts) terminate TLS at a load balancer and forward
  // plain HTTP internally with an X-Forwarded-* header. Without this, Express
  // never sees the request as "secure", which breaks `secure: true` cookies
  // and req.ip (used for session/audit logging) would reflect the proxy, not
  // the real client.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // ─── Security Middleware ───────────────────────────────────────────────────
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: corsOrigins.length > 1 ? corsOrigins : corsOrigins[0],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ─── Compression ──────────────────────────────────────────────────────────
  app.use(compression());

  // ─── Global Prefix ────────────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── Validation ───────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,          // Auto-transform payloads to DTO types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Swagger Docs ─────────────────────────────────────────────────────────
  // Exposing full API schemas/routes publicly is unnecessary attack-surface in
  // production. Enable there only intentionally via ENABLE_SWAGGER=true.
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const enableSwagger = configService.get<string>('ENABLE_SWAGGER') === 'true';
  if (!isProduction || enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Happy Store API')
      .setDescription('Enterprise-grade API for the Happy Store platform')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Health', 'System health monitoring')
      .addTag('Auth', 'Authentication and authorization')
      .addTag('Users', 'User management')
      .addTag('Shops', 'Shop management')
      .addTag('Products', 'Product catalogue')
      .addTag('Orders', 'Order lifecycle management')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Lets Nest call onModuleDestroy() (e.g. PrismaService disconnecting) when
  // the process receives SIGTERM/SIGINT — without this, Render's rolling
  // deploys and restarts kill the process before in-flight work/connections
  // are cleaned up.
  app.enableShutdownHooks();

  await app.listen(port);
  const logger = new Logger('Bootstrap');
  logger.log(`Happy Store API running on port ${port}`);
  if (!isProduction || enableSwagger) {
    logger.log(`Swagger docs available at /api/docs`);
  }
}

bootstrap();
