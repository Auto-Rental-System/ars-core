import { Injectable } from '@nestjs/common';

import { Payment } from 'model';
import { PaymentResponse } from 'interface/apiResponse';

@Injectable()
export class PaymentFormatter {
	public toPaymentResponse(payment: Payment): PaymentResponse {
		return {
			userId: payment.userId,
			type: payment.type,
			status: payment.status,
			grossValue: payment.grossValue,
			netValue: payment.netValue,
			paypalFee: payment.paypalFee,
			serviceFee: payment.serviceFee,
		};
	}
}
