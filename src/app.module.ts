import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { SystemModule, UserModule, CarModule, CronModule, WebhookModule, ReportModule } from './module';
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
		ScheduleModule.forRoot(),
		CronModule,
		SystemModule,
		UserModule,
		CarModule,
		WebhookModule,
		ReportModule,
	],
})
export class AppModule {}
