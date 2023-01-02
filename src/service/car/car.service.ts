import { Injectable } from '@nestjs/common';

import { CreateCarRequest, UpdateCarRequest } from 'interface/apiRequest';
import { Car, User } from 'model';
import { CarRepository } from 'repository';
import { ApplicationError } from 'shared/error';
import { Fuel, Gearbox } from '../../entity/car.entity';

@Injectable()
export class CarService {
	constructor(private readonly carRepository: CarRepository) {}

	public async getById(id: number): Promise<Car> {
		const car = await this.carRepository.getById(id);

		if (!car) {
			throw new CarNotExistError();
		}

		return car;
	}

	public async create(body: CreateCarRequest, user: User): Promise<Car> {
		let car = new Car(
			body.brand,
			body.model,
			body.description,
			body.fuel,
			body.gearbox,
			body.engineCapacity,
			body.fuelConsumption,
			body.pledge,
			body.price,
			user.id,
		);

		car = await this.carRepository.insert(car);

		return car;
	}

	public async update(car: Car, body: UpdateCarRequest): Promise<Car> {
		car.brand = body.brand;
		car.model = body.model;
		car.description = body.description;
		car.fuel = body.fuel;
		car.gearbox = body.gearbox;
		car.engineCapacity = body.engineCapacity;
		car.fuelConsumption = body.fuelConsumption;
		car.pledge = body.pledge;
		car.price = body.price;

		car = await this.carRepository.update(car);
		return car;
	}
}

export class CarNotExistError extends ApplicationError {}
