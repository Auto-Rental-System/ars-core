import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { UserIdentityEntity } from './user_identity.entity';

export enum UserRole {
	Renter = 'Renter',
	Landlord = 'Landlord',
}

export enum UserStatus {
	Active = 'Active',
	Suspend = 'Suspend',
}

@Entity('user')
@Unique(['userIdentityId', 'role'])
export class UserEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'first_name',
	})
	firstName: string;

	@Column({
		name: 'last_name',
	})
	lastName: string;

	@Column({
		type: 'enum',
		enum: UserRole,
	})
	role: UserRole;

	@Column({
		type: 'enum',
		enum: UserStatus,
	})
	status: UserStatus;

	@CreateDateColumn({
		nullable: true,
		name: 'created_at',
	})
	createdAt: Date;

	@ManyToOne(type => UserIdentityEntity, identity => identity.users, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'user_identity_id' })
	userIdentity: UserIdentityEntity;

	@RelationId((user: UserEntity) => user.userIdentity)
	@Column({
		name: 'user_identity_id',
	})
	userIdentityId: number;

}
