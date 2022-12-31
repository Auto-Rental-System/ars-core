import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'shared/request';
import { METADATA_ROLE_KEY } from 'shared/decorator/roles.decorator';
import { UserRole } from 'entity/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	public canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>(METADATA_ROLE_KEY, context.getHandler()) as Array<UserRole>;

		if (!roles.length) {
			return true;
		}

		const request: Request = context.switchToHttp().getRequest();
		const user = request.user;

		if (roles.includes(user.role)) {
			return true;
		}

		return false;
	}
}
