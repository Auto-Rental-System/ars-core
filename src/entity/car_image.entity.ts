import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { CarEntity } from './car.entity';

@Entity('car_image')
export class CarImageEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;

	@Column()
	name: string;

	@Column({
		name: 'is_title',
	})
	isTitle: boolean;

	@ManyToOne(type => CarEntity, car => car.images, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'car_id' })
	car: CarEntity;

	@RelationId((image: CarImageEntity) => image.car)
	@Column({
		name: 'car_id',
	})
	carId: number;
}
