import { NEW_ID } from 'shared/util/util';

export class RentalOrder {
	constructor(
		public startAt: Date,
		public endAt: Date,
		public readonly userId: number,
		public readonly carId: number,
		public readonly paypalOrderId: string,
		public readonly id = NEW_ID,
	) {}
}
