import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	RelationId,
	OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RentalOrderEntity } from './rental_order.entity';
import { CarImageEntity } from './car_image.entity';

export enum Fuel {
	Petrol = 'Petrol',
	Diesel = 'Diesel',
	Hybrid = 'Hybrid',
	Electric = 'Electric',
}

export enum Gearbox {
	Manual = 'Manual',
	Automatic = 'Automatic',
}

@Entity('car')
export class CarEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;

	@Column()
	brand: string;

	@Column()
	model: string;

	@Column()
	description: string;

	// it will store from -9.9 to 9.9
	@Column({
		name: 'engine_capacity',
		type: 'numeric',
		precision: 2,
		scale: 1,
	})
	engineCapacity: string;

	@Column({
		type: 'enum',
		enum: Fuel,
	})
	fuel: Fuel;

	// it will store from -99.9 to 99.9
	@Column({
		name: 'fuel_consumption',
		type: 'numeric',
		precision: 3,
		scale: 1,
	})
	fuelConsumption: string;

	@Column({
		type: 'enum',
		enum: Gearbox,
	})
	gearbox: Gearbox;

	@Column({
		type: 'smallint',
	})
	pledge: number;

	@Column({
		type: 'smallint',
	})
	price: number;

	@ManyToOne(type => UserEntity, user => user.cars, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;

	@RelationId((car: CarEntity) => car.user)
	@Column({
		name: 'user_id',
	})
	userId: number;

	@OneToMany(type => RentalOrderEntity, order => order.car, { cascade: true })
	orders: RentalOrderEntity[];

	@OneToMany(type => CarImageEntity, image => image.car, { cascade: true })
	images: CarImageEntity[];
}
