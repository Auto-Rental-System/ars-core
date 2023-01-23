import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreatePayoutBody, PayoutItemTransactionStatus, PaypalService } from 'service/paypal';
import { Car, Payment, RentalOrder, User } from 'model';
import { PaymentStatus, PaymentType } from 'entity/payment.entity';
import { PayoutConfig } from 'config/interfaces';
import { Result, toDoublePrecisionFloat } from 'shared/util/util';
import { ApplicationError } from 'shared/error';
import { PaymentRepository } from 'repository';
import { TotalPayment } from 'repository/payment_repository';

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

	public async getById(id: number): Promise<Payment> {
		const payment = await this.paymentRepository.getById(id);

		if (!payment) {
			throw new PaymentDoesNotExists();
		}

		return payment;
	}

	public async getByPaypalPayoutId(paypalPayoutId: string): Promise<Payment> {
		const payment = await this.paymentRepository.getByPaypalPayoutId(paypalPayoutId);

		if (!payment) {
			throw new PaymentDoesNotExists();
		}

		return payment;
	}

	public async getByOrdersAndType(orders: Array<RentalOrder>, type: PaymentType): Promise<Array<Payment>> {
		const orderIds = orders.map(order => order.id);
		return await this.paymentRepository.getByOrderIdsAndType(orderIds, type);
	}

	public async getByRentalOrderAndType(order: RentalOrder, type: PaymentType): Promise<Result<Payment>> {
		return await this.paymentRepository.getByRentalOrderIdAndType(order.id, type);
	}

	public async setPaymentStatus(payment: Payment, status: PaymentStatus): Promise<Payment> {
		return this.paymentRepository.setPaymentStatus(payment.id, status);
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

	public projectPayoutItemTransactionStatus(transactionStatus: PayoutItemTransactionStatus): PaymentStatus {
		const projection: Record<PayoutItemTransactionStatus, PaymentStatus> = {
			SUCCESS: PaymentStatus.Success,
			FAILED: PaymentStatus.Failed,
			PENDING: PaymentStatus.Pending,
			UNCLAIMED: PaymentStatus.Unclaimed,
			RETURNED: PaymentStatus.Returned,
			ONHOLD: PaymentStatus.OnHold,
			BLOCKED: PaymentStatus.Blocked,
			REFUNDED: PaymentStatus.Refunded,
			REVERSED: PaymentStatus.Reversed,
		};

		return projection[transactionStatus];
	}

	public async createPayoutPayment(
		checkoutPayment: Payment,
		rentalOrder: RentalOrder,
		landlord: User,
	): Promise<Payment> {
		const serviceFee = (checkoutPayment.netValue * this.payoutConfig.serviceFeePercentage) / 100;
		let payoutValue = checkoutPayment.netValue - serviceFee;
		payoutValue = toDoublePrecisionFloat(payoutValue);

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
		const payoutItem = payout.items[0];

		let payoutPayment = new Payment(
			rentalOrder.id,
			landlord.id,
			PaymentType.Payout,
			this.projectPayoutItemTransactionStatus(payoutItem.transaction_status),
			parseFloat(payoutItem.payout_item.amount.value),
			parseFloat(payoutItem.payout_item_fee.value),
			serviceFee,
			payoutItem.payout_item_id,
		);
		payoutPayment = await this.paymentRepository.insert(payoutPayment);

		return payoutPayment;
	}

	public async getCarsTotalPayments(cars: Array<Car>, type: PaymentType): Promise<Map<number, TotalPayment>> {
		const carIds = cars.map(car => car.id);
		return this.paymentRepository.getCarsTotalPayments(carIds, type);
	}
}

export class PaymentDoesNotExists extends ApplicationError {}
