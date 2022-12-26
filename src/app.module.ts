import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemModule, UserModule } from './module';
import configuration from 'config/configuration';
import dbConfig from 'config/db.config';
import { DatabaseConfig } from 'config/interfaces';

import { UserService } from 'service/user';
import { AuthService } from 'service/auth'
import { UserRepository } from 'repository';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true,
			cache: true,
		}),
		TypeOrmModule.forRoot(dbConfig() as DatabaseConfig),
		UserModule,
		SystemModule,
	],
	providers: [AuthService, UserService, UserRepository],
})
export class AppModule {}
