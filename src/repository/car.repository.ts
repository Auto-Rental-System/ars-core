import { EntityManager, In } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Result } from 'shared/util/util';
import { Car } from 'model';
import { CarEntity } from 'entity/car.entity';
import { CarPaginationRequest, OwnCarPaginationRequest } from 'value_object/pagination_request';
import { applyFilters, applyPaginationParams, ListWithTotal } from 'shared/util/typeorm';

@Injectable()
export class CarRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<Car>> {
		const carEntity = await this.manager.createQueryBuilder(CarEntity, 'car').where({ id }).getOne();

		return this.convertToModel(carEntity);
	}

	public async getByIds(ids: Array<number>): Promise<Array<Car>> {
		const carEntities = await this.manager
			.createQueryBuilder(CarEntity, 'car')
			.where({ id: In(ids) })
			.getMany();

		return carEntities.map(carEntity => this.convertToModel(carEntity)) as Array<Car>;
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
				engineCapacity: `${car.engineCapacity}`,
				fuelConsumption: `${car.fuelConsumption}`,
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
				engineCapacity: `${car.engineCapacity}`,
				fuelConsumption: `${car.fuelConsumption}`,
				pledge: car.pledge,
				price: car.price,
			})
			.where({ id: car.id })
			.execute();

		return (await this.getById(car.id)) as Car;
	}

	public async getAllCars(paginationRequest: CarPaginationRequest): Promise<ListWithTotal<Car>> {
		let carEntitiesQuery = this.manager.createQueryBuilder(CarEntity, 'car');
		carEntitiesQuery = applyFilters(carEntitiesQuery, paginationRequest.filters);

		const total = await carEntitiesQuery.getCount();

		carEntitiesQuery = applyPaginationParams(carEntitiesQuery, paginationRequest);
		const carEntities = await carEntitiesQuery.getMany();

		return {
			list: carEntities.map(carEntity => this.convertToModel(carEntity)) as Array<Car>,
			total,
		};
	}

	public async getOwnCars(paginationRequest: OwnCarPaginationRequest, userId: number): Promise<ListWithTotal<Car>> {
		let carEntitiesQuery = this.manager.createQueryBuilder(CarEntity, 'car');
		carEntitiesQuery = applyFilters(carEntitiesQuery, paginationRequest.filters);
		carEntitiesQuery = carEntitiesQuery.andWhere('car.user_id = :userId', { userId });

		const total = await carEntitiesQuery.getCount();

		carEntitiesQuery = applyPaginationParams(carEntitiesQuery, paginationRequest);
		const carEntities = await carEntitiesQuery.getMany();

		return {
			list: carEntities.map(carEntity => this.convertToModel(carEntity)) as Array<Car>,
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
				parseFloat(carEntity.engineCapacity),
				parseFloat(carEntity.fuelConsumption),
				carEntity.pledge,
				carEntity.price,
				carEntity.userId,
				carEntity.id,
			);
		}
	}
}
