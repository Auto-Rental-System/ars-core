import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserService } from 'service/user';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	constructor(private reflector: Reflector, private userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();

		const authHeader = req.headers['authorization'];
		const accessToken: string = authHeader ? authHeader.split('Bearer ')[1] : '';

		try {
			const user = await this.userService.getUserByToken(accessToken);

			Object.defineProperty(req, 'user', { value: user });
			return true;
		} catch (e) {}

		throw new UnauthorizedException();
	}
}
