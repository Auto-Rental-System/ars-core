import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { UserEntity } from 'src/entity/user.entity';
import { User } from 'src/model/user';
import { Result } from 'src/shared/util/util';

@Injectable()
export class UserRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<User>> {
		const userEntity = await this.manager
			.getRepository(UserEntity)
			.createQueryBuilder()
			.where('id = :id', { id })
			.getOne();

		return this.convertToModel(userEntity);
	}

	public async insertUser(user: User): Promise<User> {
		const { raw } = await this.manager.createQueryBuilder().insert().into(UserEntity).values({}).execute();

		return (await this.getById(raw[0].id)) as User;
	}

	public convertToModel(userEntity?: UserEntity): Result<User> {
		if (userEntity) {
			return new User(userEntity.id);
		}
	}
}
