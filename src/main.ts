import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { SwaggerConfig } from './config/interfaces';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { UserService } from './service/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);

  app.enableCors();

  const swagger: SwaggerConfig = configService.get('swagger') as SwaggerConfig;
  const config = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'authorization')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  const userService = app.get(UserService);
  app.useGlobalInterceptors(new AuthenticationInterceptor(userService), new ErrorInterceptor());

  const port = configService.get('port');

  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();