import { Injectable } from '@nestjs/common';

import { Car, RentalOrder, User } from 'model';
import { RentCarRequest } from 'interface/apiRequest';
import { ApplicationError } from 'shared/error';
import { PaymentService } from 'service/payment';
import { RentalOrderRepository } from 'repository';

@Injectable()
export class CarRentalService {
	constructor(
		private readonly rentalOrderRepository: RentalOrderRepository,
		private readonly paymentService: PaymentService,
	) {}

	public async rent(car: Car, body: RentCarRequest, user: User): Promise<Array<RentalOrder>> {
		let rentalOrder = new RentalOrder(body.startAt, body.endAt, user.id, car.id, body.orderId);

		rentalOrder = await this.rentalOrderRepository.insert(rentalOrder);

		await this.paymentService.createCheckoutPayment(body.orderId, rentalOrder);

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
