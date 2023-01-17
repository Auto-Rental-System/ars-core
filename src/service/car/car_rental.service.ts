import { Injectable } from '@nestjs/common';

import { RentalOrderRepository } from 'repository';
import { Car, RentalOrder, User } from 'model';
import { RentCarRequest } from 'interface/apiRequest';
import { ApplicationError } from 'shared/error';

@Injectable()
export class CarRentalService {
	constructor(private readonly rentalOrderRepository: RentalOrderRepository) {}

	public async rent(car: Car, body: RentCarRequest, user: User): Promise<Array<RentalOrder>> {
		const rentalOrder = new RentalOrder(body.startAt, body.endAt, user.id, car.id, body.orderId);

		await this.rentalOrderRepository.insert(rentalOrder);
		return await this.getCarRentalOrders(car);
	}

	public async ensureNoRentalOrdersByPaypalOrderId(paypalOrderId): Promise<void> {
		const count = await this.rentalOrderRepository.getByPaypalOrderIdCount(paypalOrderId);

		if (count > 0) {
			throw new PaypalOrderAlreadyExistsError();
		}
	}

	public async ensureNoCarRentalPeriodsIntercepts(
		car: Car,
		{ startAt, endAt }: { startAt: Date; endAt: Date },
	): Promise<void> {
		const ordersInPeriod = await this.rentalOrderRepository.getInPeriodCount(car.id, startAt, endAt);
		console.log({ ordersInPeriod });

		if (ordersInPeriod) {
			throw new CarIsRentedInEnteredPeriodError();
		}
	}

	public async getCarRentalOrders(car: Car): Promise<Array<RentalOrder>> {
		return await this.rentalOrderRepository.getByCarId(car.id);
	}
}

export class PaypalOrderAlreadyExistsError extends ApplicationError {}
export class CarIsRentedInEnteredPeriodError extends ApplicationError {}
