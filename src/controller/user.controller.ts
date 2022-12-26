import { Controller, Req, Post, Get, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { RegisterUserRequest } from 'interface/apiRequest';
import { UserResponse } from 'interface/apiResponse';
import { AuthService } from 'service/auth';
import { UserFormatter, UserService } from 'service/user';
import { Request } from 'shared/request';

@Controller('users')
@ApiTags('User')
export class UserController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly userFormatter: UserFormatter,
	) {}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	public async register(@Body() body: RegisterUserRequest): Promise<UserResponse> {
		await this.authService.ensureCognitoAccountExists(body.email);

		const user = await this.userService.registerUser(body);
		return this.userFormatter.toUserResponse(user);
	}

	@Get('current')
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth('authorization')
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	public async getCurrent(@Req() { user }: Request): Promise<UserResponse> {
		return this.userFormatter.toUserResponse(user);
	}
}