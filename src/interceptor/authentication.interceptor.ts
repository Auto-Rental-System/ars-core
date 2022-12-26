import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserService } from 'service/user';
import { ApplicationError } from 'shared/error';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
	private endpointsToBypass = [
		{ url: '/system/healthy', method: 'GET' },
		{ url: '/users/register', method: 'POST' },
	];

	constructor(private readonly userService: UserService) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const req = context.switchToHttp().getRequest();
		const { url, method } = req;

		const endpointShouldBeBypassed = this.endpointsToBypass.some(endpoint => {
			return endpoint.url === url && endpoint.method === method;
		});
		if (endpointShouldBeBypassed) {
			return next.handle();
		}

		const authHeader = req.headers['authorization'];
		const accessToken: string = authHeader ? authHeader.split('Bearer ')[1] : '';

		try {
			const user = await this.userService.getUserByToken(accessToken);

			Object.defineProperty(req, 'user', { value: user });
		} catch (e) {
			throw new UnauthorizedError('Unauthorized', HttpStatus.UNAUTHORIZED);
		}
		return next.handle();
	}
}

export class UnauthorizedError extends ApplicationError {}
