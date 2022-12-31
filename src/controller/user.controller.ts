import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RegisterUserRequest } from 'interface/apiRequest';
import { UserResponse } from 'interface/apiResponse';
import { AuthService } from 'service/auth';
import { UserFormatter, UserService } from 'service/user';
import { Request } from 'shared/request';
import { Auth } from 'shared/decorator';

@Controller('users')
@ApiTags('User')
export class UserController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly userFormatter: UserFormatter,
	) {}

	@Post('register')
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	public async register(@Body() body: RegisterUserRequest): Promise<UserResponse> {
		await this.authService.ensureCognitoAccountExists(body.email);

		const user = await this.userService.registerUser(body);

		// temporary to confirm sign up
		await this.authService.confirmSignUp(user.email);

		return this.userFormatter.toUserResponse(user);
	}

	@Get('current')
	@Auth()
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	public async getCurrent(@Req() { user }: Request): Promise<UserResponse> {
		return this.userFormatter.toUserResponse(user);
	}
}
