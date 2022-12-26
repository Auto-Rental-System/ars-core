import { Module } from '@nestjs/common';

import { UserController } from 'controller';
import { AuthService } from 'service/auth';
import { UserService, UserFormatter } from 'service/user';
import { UserRepository } from 'repository';

@Module({
	imports: [],
	controllers: [UserController],
	providers: [AuthService, UserRepository, UserService, UserFormatter],
})
export class UserModule {}
