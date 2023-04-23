import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RegisterUserRequest } from 'interface/apiRequest';
import { UserResponse } from 'interface/apiResponse';
import { AuthService } from 'service/auth';
import { UserFormatter, UserService } from 'service/user';
import { Auth, RequestingUser } from 'shared/decorator';
import { User } from 'model';

@Controller('users')
@ApiTags('User')
export class UserController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly userFormatter: UserFormatter,
	) {}

	@Post('/register')
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	public async register(@Body() body: RegisterUserRequest): Promise<UserResponse> {
		await this.authService.ensureCognitoAccountExists(body.email);

		const user = await this.userService.registerUser(body);

		return this.userFormatter.toUserResponse(user);
	}

	@Get('/current')
	@Auth()
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	public async getCurrent(@RequestingUser() user: User): Promise<UserResponse> {
		return this.userFormatter.toUserResponse(user);
	}

	@Post('/role/switch')
	@Auth()
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	public async switchRole(@RequestingUser() user: User): Promise<UserResponse> {
		const updatedUser = await this.userService.switchRole(user);

		return this.userFormatter.toUserResponse(updatedUser);
	}
}
