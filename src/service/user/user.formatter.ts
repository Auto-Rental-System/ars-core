import { Injectable } from '@nestjs/common';

import { UserResponse } from 'interface/apiResponse';
import { User } from 'model';

@Injectable()
export class UserFormatter {
	public toUserResponse(user: User): UserResponse {
		return {
			id: user.id,
		};
	}
}
