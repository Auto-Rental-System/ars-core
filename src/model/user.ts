import { NEW_ID } from 'shared/util/util';
import { UserRole } from 'entity/user.entity';

export class User {
	constructor(
		public readonly email: string,
		public readonly firstName: string,
		public readonly lastName: string,
		public readonly role: UserRole,
		public readonly id: number = NEW_ID,
		public readonly userIdentityId: number = NEW_ID,
	) {}
}
