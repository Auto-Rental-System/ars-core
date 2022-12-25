import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_identity')
export class UserIdentityEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({
		nullable: true,
		name: 'created_at',
	})
	createdAt: Date;

	@Column({
		unique: true,
	})
  email: string;

	@Column({
		name: 'first_name',
	})
	firstName: string;

	@Column({
		name: 'last_name',
	})
	lastName: string;

	@OneToMany(type => UserEntity, user => user.userIdentity, { cascade: true })
	users: UserEntity[];

}
