import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { UserEntity } from './user.entity';
import { CarEntity } from './car.entity';

@Entity('car_rental_order')
export class CarRentalOrderEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;

	@Column({
		name: 'start_at',
		type: 'timestamp',
	})
	startAt: Date;

	@Column({
		name: 'end_at',
		type: 'timestamp',
	})
	endAt: Date;

	@ManyToOne(type => UserEntity, user => user.orders, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;

	@RelationId((order: CarRentalOrderEntity) => order.user)
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

	@RelationId((order: CarRentalOrderEntity) => order.car)
	@Column({
		name: 'car_id',
	})
	carId: number;
}