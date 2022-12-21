import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserRepository } from 'src/repository';
import { User } from 'src/model';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository, private readonly configService: ConfigService) {}

	public async getUserByToken(token: string): Promise<User> {
		return new User();
	}
}
