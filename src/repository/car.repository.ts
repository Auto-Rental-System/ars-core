import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Result } from 'shared/util/util';
import { Car } from 'model';
import { CarEntity } from 'entity/car.entity';
import { CarPaginationRequest } from 'value_object/pagination_request/car_pagination_request';

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

	public async getAllCars(paginationRequest: CarPaginationRequest): Promise<{ list: Array<Car>; total: number }> {
		let carEntitiesQuery = this.manager.createQueryBuilder(CarEntity, 'car');

		carEntitiesQuery = paginationRequest.filters.reduce((query, filter, i) => {
			return i === 0
				? query.where(`${filter.key} = :value`, { value: filter.value })
				: query.andWhere(`${filter.key} = :value`, { value: filter.value });
		}, carEntitiesQuery);

		const total = await carEntitiesQuery.getCount();

		if (paginationRequest.orderBy) {
			carEntitiesQuery = carEntitiesQuery.orderBy(paginationRequest.orderBy, paginationRequest.order);
		}

		const carEntities = await carEntitiesQuery
			.limit(paginationRequest.rowsPerPage)
			.offset((paginationRequest.page - 1) * paginationRequest.rowsPerPage)
			.getMany();

		return {
			list: carEntities.map(this.convertToModel) as Array<Car>,
			total,
		};
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
