import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemModule, UserModule, CarModule } from './module';
import configuration from 'config/configuration';
import dbConfig from 'config/db.config';
import { DatabaseConfig } from 'config/interfaces';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true,
			cache: true,
		}),
		TypeOrmModule.forRoot(dbConfig() as DatabaseConfig),
		SystemModule,
		UserModule,
		CarModule,
	],
})
export class AppModule {}
