import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PaymentRepository } from 'repository';
import { CreatePayoutBody, PayoutBatchHeader, PaypalService } from 'service/paypal';
import { Payment, RentalOrder, User } from 'model';
import { PaymentStatus, PaymentType } from 'entity/payment.entity';
import { Result } from 'shared/util/util';
import { PayoutConfig } from 'config/interfaces';

@Injectable()
export class PaymentService {
	private payoutConfig: PayoutConfig;

	constructor(
		private readonly paymentRepository: PaymentRepository,
		private readonly paypalService: PaypalService,
		private readonly configService: ConfigService,
	) {
		this.payoutConfig = this.configService.get('payout') as PayoutConfig;
	}

	public async getByRentalOrderAndType(order: RentalOrder, type: PaymentType): Promise<Result<Payment>> {
		return await this.paymentRepository.getByRentalOrderIdAndType(order.id, type);
	}

	public async createCheckoutPayment(paypalOrderId: string, rentalOrder: RentalOrder): Promise<Payment> {
		const order = await this.paypalService.getOrderById(paypalOrderId);
		const captures = order.purchase_units[0].payments?.captures || [];

		const { grossValue, paypalFee } = captures.reduce(
			(acc, c) => ({
				grossValue: acc.grossValue + parseInt(c.seller_receivable_breakdown?.gross_amount?.value || '0'),
				paypalFee: acc.paypalFee + parseInt(c.seller_receivable_breakdown?.paypal_fee?.value || '0'),
			}),
			{ grossValue: 0, paypalFee: 0 },
		);

		const payment = new Payment(
			rentalOrder.id,
			rentalOrder.userId,
			PaymentType.Checkout,
			PaymentStatus.Success,
			grossValue,
			paypalFee,
		);
		return this.paymentRepository.insert(payment);
	}

	private projectPayoutBatchStatus(batchStatus: PayoutBatchHeader['batch_status']): PaymentStatus {
		const projection: Record<PayoutBatchHeader['batch_status'], PaymentStatus> = {
			DENIED: PaymentStatus.Denied,
			PENDING: PaymentStatus.Pending,
			PROCESSING: PaymentStatus.Processing,
			SUCCESS: PaymentStatus.Success,
			CANCELED: PaymentStatus.Canceled,
		};

		return projection[batchStatus];
	}

	public async createPayoutPayment(
		checkoutPayment: Payment,
		rentalOrder: RentalOrder,
		landlord: User,
	): Promise<Payment> {
		const serviceFee = (checkoutPayment.netValue * this.payoutConfig.serviceFeePercentage) / 100;
		const payoutValue = checkoutPayment.netValue - serviceFee;

		const body: CreatePayoutBody = {
			sender_batch_header: {
				email_subject: `Income from rental order #${rentalOrder.id}`,
				email_message: `
					Car was rented from ${rentalOrder.startAt.toDateString()} to ${rentalOrder.endAt.toDateString()}. 
					Total income is ${checkoutPayment.netValue}*.
					* - without Paypal fee.
				`,
			},
			items: [
				{
					recipient_type: 'EMAIL',
					amount: {
						value: payoutValue.toString(),
						currency: 'USD',
					},
					receiver: landlord.email,
				},
			],
		};
		const createPayoutResponse = await this.paypalService.createPayout(body);
		const payout = await this.paypalService.getPayoutByBatchId(createPayoutResponse.batch_header.payout_batch_id);

		let payoutPayment = new Payment(
			rentalOrder.id,
			landlord.id,
			PaymentType.Payout,
			this.projectPayoutBatchStatus(payout.batch_header.batch_status),
			parseFloat(payout.batch_header.amount.value),
			parseFloat(payout.batch_header.fees.value),
			serviceFee,
		);
		payoutPayment = await this.paymentRepository.insert(payoutPayment);

		return payoutPayment;
	}
}
