import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { UserEntity } from './user.entity';
import { CarEntity } from './car.entity';

@Entity('rental_order')
export class RentalOrderEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;

	@Column({
		name: 'start_at',
		type: 'date',
	})
	startAt: Date;

	@Column({
		name: 'end_at',
		type: 'date',
	})
	endAt: Date;

	@ManyToOne(type => UserEntity, user => user.orders, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;

	@RelationId((order: RentalOrderEntity) => order.user)
	@Column({
		name: 'user_id',
	})
	userId: number;

	@ManyToOne(type => CarEntity, car => car.orders, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'car_id' })
	car: CarEntity;

	@RelationId((order: RentalOrderEntity) => order.car)
	@Column({
		name: 'car_id',
	})
	carId: number;
}
