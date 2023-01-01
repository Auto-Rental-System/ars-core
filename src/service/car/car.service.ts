import { Injectable } from '@nestjs/common';

import { CreateCarRequest } from 'interface/apiRequest';
import { Car, User } from 'model';
import { CarRepository } from 'repository';

@Injectable()
export class CarService {
	constructor(
		private readonly carRepository: CarRepository,
	) {
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
}
