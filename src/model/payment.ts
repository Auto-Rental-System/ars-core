import { PaymentType } from 'entity/payment.entity';
import { NEW_ID } from 'shared/util/util';

export class Payment {
	constructor(
		public readonly rentalOrderId: number,
		public readonly userId: number,
		public readonly type: PaymentType,
		// from 0 to 99999.99
		public readonly grossValue: number,
		// from 0 to 9999.99
		public readonly paypalFee?: number,
		// from 0 to 9999.99
		public readonly serviceFee?: number,
		public id: number = NEW_ID,
	) {}
}
