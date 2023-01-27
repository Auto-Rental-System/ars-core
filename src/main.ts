import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { SwaggerConfig } from 'config/interfaces';
import { ErrorInterceptor } from 'interceptor';

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

	app.useGlobalInterceptors(new ErrorInterceptor());

	app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

	const port = configService.get('port');

	await app.listen(port);

	logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
