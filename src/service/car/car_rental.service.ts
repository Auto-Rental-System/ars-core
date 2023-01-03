import { Injectable } from '@nestjs/common';

import { RentalOrderRepository } from 'repository';
import { Car, RentalOrder, User } from 'model';
import { RentCarRequest } from 'interface/apiRequest';

@Injectable()
export class CarRentalService {
	constructor(private readonly rentalOrderRepository: RentalOrderRepository) {}

	public async rent(car: Car, body: RentCarRequest, user: User): Promise<Array<RentalOrder>> {
		const rentalOrder = new RentalOrder(body.startAt, body.endAt, user.id, car.id);

		await this.rentalOrderRepository.insert(rentalOrder);
		return await this.getCarRentalOrders(car);
	}

	public async getCarRentalOrders(car: Car): Promise<Array<RentalOrder>> {
		return await this.rentalOrderRepository.getCarRentalOrders(car.id);
	}
}
