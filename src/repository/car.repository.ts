import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Result } from 'shared/util/util';
import { Car } from 'model';
import { CarEntity } from 'entity/car.entity';

@Injectable()
export class CarRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<Car>> {
		const carEntity = await this.manager.createQueryBuilder(CarEntity, 'car').where({ id }).getOne();

		return this.convertToModel(carEntity);
	}

	public async insert(car: Car): Promise<Car> {
		const { identifiers } = await this.manager
			.createQueryBuilder()
			.insert()
			.into(CarEntity)
			.values({
				brand: car.brand,
				model: car.model,
				description: car.description,
				fuel: car.fuel,
				gearbox: car.gearbox,
				engineCapacity: car.engineCapacity,
				fuelConsumption: car.fuelConsumption,
				pledge: car.pledge,
				price: car.price,
				userId: car.userId,
			})
			.execute();

		return (await this.getById(identifiers[0].id)) as Car;
	}

	public async update(car: Car): Promise<Car> {
		await this.manager
			.createQueryBuilder()
			.update(CarEntity)
			.set({
				brand: car.brand,
				model: car.model,
				description: car.description,
				fuel: car.fuel,
				gearbox: car.gearbox,
				engineCapacity: car.engineCapacity,
				fuelConsumption: car.fuelConsumption,
				pledge: car.pledge,
				price: car.price,
			})
			.where({ id: car.id })
			.execute();

		return (await this.getById(car.id)) as Car;
	}
	private convertToModel(carEntity?: CarEntity): Result<Car> {
		if (carEntity) {
			return new Car(
				carEntity.brand,
				carEntity.model,
				carEntity.description,
				carEntity.fuel,
				carEntity.gearbox,
				carEntity.engineCapacity,
				carEntity.fuelConsumption,
				carEntity.pledge,
				carEntity.price,
				carEntity.userId,
				carEntity.id,
			);
		}
	}
}
