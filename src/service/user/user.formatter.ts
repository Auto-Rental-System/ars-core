import { Injectable } from '@nestjs/common';

import { UserResponse } from 'interface/apiResponse';
import { User } from 'model';

@Injectable()
export class UserFormatter {
	public toUserResponse(user: User): UserResponse {
		return {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
		};
	}
}
