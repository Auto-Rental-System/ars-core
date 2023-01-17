import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	RelationId,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CarEntity } from './car.entity';
import { PaymentEntity } from './payment.entity';

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

	@Column({
		name: 'paypal_order_id',
		unique: true,
	})
	paypalOrderId: string;

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

	@OneToMany(type => PaymentEntity, payment => payment.rentalOrder, { cascade: true })
	payments: PaymentEntity[];
}
