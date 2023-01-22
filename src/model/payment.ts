import { PaymentStatus, PaymentType } from 'entity/payment.entity';
import { NEW_ID, toDoublePrecisionFloat } from 'shared/util/util';

export class Payment {
	constructor(
		public readonly rentalOrderId: number,
		public readonly userId: number,
		public readonly type: PaymentType,
		public readonly status: PaymentStatus,
		// from 0 to 99999.99
		public readonly grossValue: number,
		// from 0 to 9999.99
		public readonly paypalFee: number = 0,
		// from 0 to 9999.99
		public readonly serviceFee: number = 0,
		public readonly paypalPayoutId?: string,
		public id: number = NEW_ID,
	) {}

	public get netValue() {
		const value = this.grossValue - this.paypalFee - this.serviceFee;
		return toDoublePrecisionFloat(value);
	}
}
