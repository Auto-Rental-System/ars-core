import { HttpStatus, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

import { ApplicationError } from 'shared/error';
import { Car } from 'model';
import { RentCarRequest } from 'interface/apiRequest';
import { PaypalClient } from './paypal_client';
import { OrderResponse } from './types';

@Injectable()
export class PaypalService {
	constructor(private readonly paypalClient: PaypalClient) {}

	public async getOrderById(orderId: string): Promise<OrderResponse> {
		return await this.paypalClient.getOrderById(orderId);
	}

	public async ensureOrderWasPaidProperly(orderId: string, expectedPayment: number): Promise<void> {
		const order = await this.getOrderById(orderId);

		if (order.status !== 'COMPLETED') {
			throw new NotCompletedOrderError();
		}

		const orderTotalValue = order.purchase_units.reduce((acc, unit) => {
			const unitPaymentsValue = (unit.payments?.captures || []).reduce((unitAcc, capture) => {
				if (capture.status !== 'COMPLETED') {
					throw new CaptureIsNotCapturedError();
				}

				if (capture.amount.currency_code !== 'USD') {
					throw new WrongCurrencyError();
				}

				return unitAcc + parseInt(capture.amount.value);
			}, 0);

			if (unit.amount.currency_code !== 'USD') {
				throw new WrongCurrencyError();
			}

			const unitAmountValue = parseInt(unit.amount.value);

			if (unitAmountValue !== unitPaymentsValue) {
				throw new InvalidOrderError();
			}

			return acc + unitAmountValue;
		}, 0);

		if (orderTotalValue !== expectedPayment) {
			throw new UnexpectedOrderValue('Unexpected Order Total Value', HttpStatus.BAD_REQUEST, {
				expected: expectedPayment,
				received: orderTotalValue,
			});
		}
	}

	public async ensureCarRentalWasPaid(car: Car, body: RentCarRequest): Promise<void> {
		const dayPrice = car.price;
		const days = dayjs(body.endAt).diff(dayjs(body.startAt), 'days') + 1;
		const totalPrice = dayPrice * days;
		await this.ensureOrderWasPaidProperly(body.orderId, totalPrice);
	}
}

export class NotCompletedOrderError extends ApplicationError {}
export class WrongCurrencyError extends ApplicationError {}
export class CaptureIsNotCapturedError extends ApplicationError {}
export class InvalidOrderError extends ApplicationError {}
export class UnexpectedOrderValue extends ApplicationError {}
