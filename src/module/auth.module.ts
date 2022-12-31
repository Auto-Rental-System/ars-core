import { Module } from '@nestjs/common';

import { UserService } from 'service/user';
import { AuthService } from 'service/auth';
import { UserRepository } from 'repository';

@Module({
	providers: [UserService, AuthService, UserRepository],
	exports: [UserService, AuthService, UserRepository],
})
export class AuthModule {}
