import { Injectable } from '@nestjs/common';

import { Car, Payment, RentalOrder, User } from 'model';
import { RentCarRequest } from 'interface/apiRequest';
import { ApplicationError } from 'shared/error';
import { PaypalService } from 'service/paypal';
import { PaymentType } from 'entity/payment.entity';
import { PaymentRepository, RentalOrderRepository } from 'repository';

@Injectable()
export class CarRentalService {
	constructor(
		private readonly rentalOrderRepository: RentalOrderRepository,
		private readonly paymentRepository: PaymentRepository,
		private readonly paypalService: PaypalService,
	) {}

	public async rent(car: Car, body: RentCarRequest, user: User): Promise<Array<RentalOrder>> {
		const rentalOrder = new RentalOrder(body.startAt, body.endAt, user.id, car.id, body.orderId);

		await this.rentalOrderRepository.insert(rentalOrder);

		const order = await this.paypalService.getOrderById(body.orderId);
		const captures = order.purchase_units[0].payments?.captures || [];

		const { grossValue, paypalFee } = captures.reduce(
			(acc, c) => ({
				grossValue: acc.grossValue + parseInt(c.seller_receivable_breakdown?.gross_amount?.value || '0'),
				paypalFee: acc.paypalFee + parseInt(c.seller_receivable_breakdown?.paypal_fee?.value || '0'),
			}),
			{ grossValue: 0, paypalFee: 0 },
		);

		const payment = new Payment(rentalOrder.id, user.id, PaymentType.Checkout, grossValue, paypalFee);
		await this.paymentRepository.insert(payment);

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
