import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { RentalOrderEntity } from './rental_order.entity';

export enum PaymentType {
	Checkout = 'Checkout',
	Payout = 'Payout',
}

@Entity('payment')
@Unique(['type', 'rentalOrderId'])
export class PaymentEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;

	@Column({
		type: 'enum',
		enum: PaymentType,
	})
	type: PaymentType;

	// from -99999.99 to 99999.99
	@Column({
		name: 'gross_value',
		type: 'numeric',
		precision: 7,
		scale: 2,
	})
	grossValue: number;

	// from -9999.99 to 9999.99
	@Column({
		name: 'paypal_fee',
		nullable: true,
		type: 'numeric',
		precision: 6,
		scale: 2,
	})
	paypalFee?: number;

	// from -9999.99 to 9999.99
	@Column({
		name: 'service_fee',
		nullable: true,
		type: 'numeric',
		precision: 6,
		scale: 2,
	})
	serviceFee?: number;

	@ManyToOne(type => UserEntity, user => user.payments, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;

	@RelationId((payment: PaymentEntity) => payment.user)
	@Column({
		name: 'user_id',
	})
	userId: number;

	@ManyToOne(type => RentalOrderEntity, rentalOrder => rentalOrder.payments, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'rental_order_id' })
	rentalOrder: RentalOrderEntity;

	@RelationId((payment: PaymentEntity) => payment.rentalOrder)
	@Column({
		name: 'rental_order_id',
	})
	rentalOrderId: number;
}