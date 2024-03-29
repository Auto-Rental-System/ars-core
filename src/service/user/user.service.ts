import { Injectable } from '@nestjs/common';

import { UserRepository } from 'repository';
import { User } from 'model';
import { AuthService } from 'service/auth';
import { RegisterUserRequest } from 'interface/apiRequest';
import { UserRole } from 'entity/user.entity';
import { Result } from 'shared/util/util';
import { ApplicationError } from 'shared/error';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository, private readonly authService: AuthService) {}

	public async getById(id: number): Promise<User> {
		const user = await this.userRepository.getById(id);

		if (!user) {
			throw new UserNotFoundError();
		}

		return user;
	}

	public async ensureUserNotExistByEmail(email: string): Promise<void> {
		const userExists = await this.userRepository.checkUserExistsByEmail(email);

		if (userExists) {
			throw new UserAlreadyExistsError();
		}
	}

	public async getUserByToken(token: string): Promise<User> {
		const account = await this.authService.getCognitoAccount(token);
		const userId: Result<string> = account.UserAttributes?.find(
			attribute => attribute.Name === AuthService.userIdAttributeName,
		)?.Value;

		if (!userId) {
			throw new NoUserIdInTokenError();
		}

		return await this.getById(parseInt(userId));
	}

	public async registerUser(body: RegisterUserRequest): Promise<User> {
		let user = new User(
			body.email,
			body.firstName,
			body.lastName,
			// that's a default role for now
			UserRole.Renter,
		);

		await this.ensureUserNotExistByEmail(user.email);

		user = await this.userRepository.insertUser(user);

		// that's necessary to define user role using token
		const attributes = { [AuthService.userIdAttributeName]: user.id.toString() };
		await this.authService.updateAccountAttributes(user.email, attributes);

		return user;
	}

	public async switchRole(user: User): Promise<User> {
		const requestedRole = user.is(UserRole.Renter) ? UserRole.Landlord : UserRole.Renter;

		let newUser = await this.userRepository.getByIdentityAndRole(user.userIdentityId, requestedRole);

		if (!newUser) {
			newUser = new User(user.email, user.firstName, user.lastName, requestedRole, user.userIdentityId);
			newUser = await this.userRepository.insertUser(newUser);
		}

		const attributes = { [AuthService.userIdAttributeName]: newUser.id.toString() };
		await this.authService.updateAccountAttributes(newUser.email, attributes);

		return newUser;
	}
}

export class NoUserIdInTokenError extends ApplicationError {}
export class UserNotFoundError extends ApplicationError {}
export class UserAlreadyExistsError extends ApplicationError {}
