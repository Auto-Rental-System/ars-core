import { Injectable } from '@nestjs/common';

import { PaymentService } from 'service/payment';
import { PayoutResponseItem, PaypalWebhookBody } from './types';

@Injectable()
export class PaypalWebhookHandler {
	constructor(private readonly paymentService: PaymentService) {}

	public async handle(webhookBody: PaypalWebhookBody<any>): Promise<void> {
		switch (webhookBody.event_type) {
			case 'PAYMENT.PAYOUTS-ITEM.BLOCKED':
			case 'PAYMENT.PAYOUTS-ITEM.CANCELED':
			case 'PAYMENT.PAYOUTS-ITEM.DENIED':
			case 'PAYMENT.PAYOUTS-ITEM.FAILED':
			case 'PAYMENT.PAYOUTS-ITEM.HELD':
			case 'PAYMENT.PAYOUTS-ITEM.REFUNDED':
			case 'PAYMENT.PAYOUTS-ITEM.RETURNED':
			case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED':
			case 'PAYMENT.PAYOUTS-ITEM.UNCLAIMED': {
				const body = webhookBody as PaypalWebhookBody<PayoutResponseItem>;

				const payment = await this.paymentService.getByPaypalPayoutId(body.resource.payout_item_id);

				const status = this.paymentService.projectPayoutItemTransactionStatus(body.resource.transaction_status);
				await this.paymentService.setPaymentStatus(payment, status);

				break;
			}
		}
	}
}
