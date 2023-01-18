import { PaymentType } from 'entity/payment.entity';
import { NEW_ID } from 'shared/util/util';

export class Payment {

	constructor(
		private readonly rentalOrderId: number,
		private readonly userId: number,
		private readonly type: PaymentType,
		// from 0 to 99999.99
		private readonly grossValue: number,
		// from 0 to 9999.99
		private readonly paypalFee?: number,
		// from 0 to 9999.99
		private readonly serviceFee?: number,
		private id: number = NEW_ID,
	) {
	}

}