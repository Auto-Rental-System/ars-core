import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { UserEntity, UserRole } from 'entity/user.entity';
import { User } from 'model';
import { NEW_ID, Result } from 'shared/util/util';
import { UserIdentityEntity } from 'entity/user_identity.entity';

@Injectable()
export class UserRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<User>> {
		const userEntity = await this.manager
			.createQueryBuilder(UserEntity, 'user')
			.leftJoinAndSelect('user.userIdentity', 'userIdentity')
			.where('user.id = :id', { id })
			.getOne();

		return this.convertToModel(userEntity);
	}

	public async getByIdentityAndRole(userIdentityId: number, role: UserRole): Promise<Result<User>> {
		const userEntity = await this.manager
			.createQueryBuilder(UserEntity, 'user')
			.leftJoinAndSelect('user.userIdentity', 'userIdentity')
			.where('userIdentity.id = :userIdentityId', { userIdentityId })
			.andWhere('user.role = :role', { role })
			.getOne();

		return this.convertToModel(userEntity);
	}

	public async checkUserExistsByEmail(email: string): Promise<boolean> {
		const count = await this.manager.createQueryBuilder(UserIdentityEntity, 'userIdentity').where({ email }).getCount();

		return count > 0;
	}

	public async insertUser(user: User): Promise<User> {
		let userIdentityId = user.userIdentityId;

		if (user.userIdentityId === NEW_ID) {
			const { raw: userIdentityRaw } = await this.manager
				.createQueryBuilder()
				.insert()
				.into(UserIdentityEntity)
				.values({
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
				})
				.execute();

			userIdentityId = userIdentityRaw[0].id;
		}

		const { raw } = await this.manager
			.createQueryBuilder()
			.insert()
			.into(UserEntity)
			.values({
				role: user.role,
				userIdentityId,
			})
			.execute();

		return (await this.getById(raw[0].id)) as User;
	}

	public convertToModel(userEntity?: UserEntity): Result<User> {
		if (userEntity) {
			return new User(
				userEntity.userIdentity.email,
				userEntity.userIdentity.firstName,
				userEntity.userIdentity.lastName,
				userEntity.role,
				userEntity.userIdentity.id,
				userEntity.id,
			);
		}
	}
}
