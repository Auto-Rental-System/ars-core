import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { UserEntity } from 'entity/user.entity';
import { User } from 'model';
import { Result } from 'shared/util/util';
import { UserIdentityEntity } from 'entity/user_identity.entity';

@Injectable()
export class UserRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<User>> {
		const userEntity = await this.manager
			.getRepository(UserEntity)
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.userIdentity', 'userIdentity')
			.where('user.id = :id', { id })
			.getOne();

		return this.convertToModel(userEntity);
	}

	public async insertUser(user: User): Promise<User> {
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

		const { raw } = await this.manager
			.createQueryBuilder()
			.insert()
			.into(UserEntity)
			.values({
				role: user.role,
				userIdentityId: userIdentityRaw[0].id,
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
				userEntity.id,
				userEntity.userIdentity.id,
			);
		}
	}
}
