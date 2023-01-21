import { Injectable } from '@nestjs/common';

import { Car, RentalOrder, User } from 'model';
import { RentCarRequest } from 'interface/apiRequest';
import { ApplicationError } from 'shared/error';
import { RentalOrderRepository } from 'repository';

@Injectable()
export class CarRentalService {
	constructor(private readonly rentalOrderRepository: RentalOrderRepository) {}

	public async rent(car: Car, body: RentCarRequest, user: User): Promise<RentalOrder> {
		let rentalOrder = new RentalOrder(body.startAt, body.endAt, user.id, car.id, body.orderId);
		rentalOrder = await this.rentalOrderRepository.insert(rentalOrder);

		return rentalOrder;
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

		if (ordersInPeriod) {
			throw new CarIsRentedInEnteredPeriodError();
		}
	}

	public async getCarRentalOrders(car: Car): Promise<Array<RentalOrder>> {
		return await this.rentalOrderRepository.getByCarId(car.id);
	}

	public async getRentalOrdersToPayout(): Promise<Array<RentalOrder>> {
		return await this.rentalOrderRepository.getRentalOrdersToPayout();
	}
}

export class PaypalOrderAlreadyExistsError extends ApplicationError {}
export class CarIsRentedInEnteredPeriodError extends ApplicationError {}
