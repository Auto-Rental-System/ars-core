import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CarRentalService, CarService } from 'service/car';
import { UserService } from 'service/user';
import { PaymentService } from 'service/payment';
import { PaymentType } from 'entity/payment.entity';

@Injectable()
export class PayoutCron {
	constructor(
		private readonly carRentalService: CarRentalService,
		private readonly carService: CarService,
		private readonly userService: UserService,
		private readonly paymentService: PaymentService,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'payout_cron' })
	public async payoutCron() {
		const rentalOrders = await this.carRentalService.getRentalOrdersToPayout();

		await Promise.all(
			rentalOrders.map(async order => {
				const car = await this.carService.getById(order.carId);
				const landlord = await this.userService.getById(car.userId);
				const checkoutPayment = await this.paymentService.getByRentalOrderAndType(order, PaymentType.Checkout);

				if (!checkoutPayment) {
					return;
				}

				await this.paymentService.createPayoutPayment(checkoutPayment, order, landlord);
			}),
		);
	}
}
