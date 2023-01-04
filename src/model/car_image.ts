import { NEW_ID } from 'shared/util/util';

export class CarImage {
	constructor(
		public readonly name: string,
		public readonly isTitle: boolean,
		public readonly carId: number,
		public readonly id: number = NEW_ID,
		public url?: string,
	) {}
}
