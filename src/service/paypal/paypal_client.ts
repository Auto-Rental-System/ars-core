import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { URL } from 'url';

import { PaypalConfig } from 'config/interfaces';
import { Result } from 'shared/util/util';
import { ApplicationError } from 'shared/error';
import {
	AuthenticationResponse,
	OrderResponse,
	Capture,
	CreatePayoutBody,
	CreatePayoutResponse,
	PayoutResponse,
	VerifyWebhookBody,
	VerifyWebhookResponse,
} from './types';

@Injectable()
export class PaypalClient {
	private readonly config: PaypalConfig;
	private accessToken: Result<string>;

	constructor(private readonly configService: ConfigService) {
		this.config = configService.get('paypal') as PaypalConfig;
	}

	public async verifyWebhookSignature(body: VerifyWebhookBody): Promise<VerifyWebhookResponse> {
		const path = `/v1/notifications/verify-webhook-signature`;

		return await this.request<VerifyWebhookResponse>(path, 'POST', body);
	}

	public async getPayment(captureId: string): Promise<Capture> {
		const path = `/v2/payments/captures/${captureId}`;

		return await this.request<Capture>(path, 'GET');
	}

	public async getOrderById(orderId: string): Promise<OrderResponse> {
		const path = `/v2/checkout/orders/${orderId}`;

		return await this.request<OrderResponse>(path, 'GET');
	}

	public async createPayout(body: CreatePayoutBody): Promise<CreatePayoutResponse> {
		const path = `/v1/payments/payouts`;

		return await this.request<CreatePayoutResponse>(path, 'POST', body);
	}

	public async getPayoutByBatchId(payoutBatchId: string): Promise<PayoutResponse> {
		const path = `/v1/payments/payouts/${payoutBatchId}`;

		return await this.request<PayoutResponse>(path, 'GET');
	}

	private async getAccessToken(): Promise<string> {
		const url = new URL('/v1/oauth2/token', this.config.apiUrl);
		const authToken = new Buffer(`${this.config.clientId}:${this.config.secret}`).toString('base64');

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Basic ${authToken}`,
			},
			// don't know why but it doesn't work with JSON body
			body: new URLSearchParams({
				grant_type: 'client_credentials',
			}),
		});
		const result = (await response.json()) as AuthenticationResponse;
		return result.access_token;
	}

	private async request<T>(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
		body?: Record<string, any>,
	): Promise<T> {
		if (!this.accessToken) {
			this.accessToken = await this.getAccessToken();
		}

		const url = new URL(path, this.config.apiUrl);

		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${this.accessToken}`,
			},
			body: body && JSON.stringify(body),
		});

		if (response.status === HttpStatus.UNAUTHORIZED) {
			this.accessToken = undefined;
			return this.request(path, method, body);
		}

		// Not success status code
		if (!response.status.toString().startsWith('2')) {
			throw new UnexpectedPaypalResponse();
		}

		return (await response.json()) as T;
	}
}

export class UnexpectedPaypalResponse extends ApplicationError {}
