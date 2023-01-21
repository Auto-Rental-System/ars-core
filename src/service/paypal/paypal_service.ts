import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { FastifyRequest } from 'fastify';

import { ApplicationError } from 'shared/error';
import { Car } from 'model';
import { RentCarRequest } from 'interface/apiRequest';
import { PaypalClient } from './paypal_client';
import { CreatePayoutBody, CreatePayoutResponse, OrderResponse, PayoutResponse, VerifyWebhookBody } from './types';
import { PaypalConfig } from 'config/interfaces';

@Injectable()
export class PaypalService {
	private paypalConfig: PaypalConfig;

	constructor(private readonly paypalClient: PaypalClient, private readonly configService: ConfigService) {
		this.paypalConfig = this.configService.get('paypal') as PaypalConfig;
	}

	public async getOrderById(orderId: string): Promise<OrderResponse> {
		return await this.paypalClient.getOrderById(orderId);
	}

	public async verifyWebhook(req: FastifyRequest): Promise<void> {
		const body: VerifyWebhookBody = {
			webhook_id: this.paypalConfig.webhookId,
			auth_algo: req.headers['paypal-auth-algo'] as string,
			cert_url: req.headers['paypal-cert-url'] as string,
			transmission_id: req.headers['paypal-transmission-id'] as string,
			transmission_sig: req.headers['paypal-transmission-sig'] as string,
			transmission_time: req.headers['paypal-transmission-time'] as string,
			webhook_event: req.body,
		};

		const response = await this.paypalClient.verifyWebhookSignature(body);

		if (response.verification_status === 'FAILURE') {
			throw new NotVerifiedPaypalWebhookSignatureError();
		}
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
			throw new UnexpectedOrderValueError('Unexpected Order Total Value', HttpStatus.BAD_REQUEST, {
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

	public async createPayout(body: CreatePayoutBody): Promise<CreatePayoutResponse> {
		return await this.paypalClient.createPayout(body);
	}

	public async getPayoutByBatchId(payoutBatchId: string): Promise<PayoutResponse> {
		return await this.paypalClient.getPayoutByBatchId(payoutBatchId);
	}
}

export class NotCompletedOrderError extends ApplicationError {}
export class WrongCurrencyError extends ApplicationError {}
export class CaptureIsNotCapturedError extends ApplicationError {}
export class InvalidOrderError extends ApplicationError {}
export class UnexpectedOrderValueError extends ApplicationError {}
export class NotVerifiedPaypalWebhookSignatureError extends ApplicationError {}
