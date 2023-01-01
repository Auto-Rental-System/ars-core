import { Fuel, Gearbox } from 'entity/car.entity';
import { NEW_ID } from 'shared/util/util';

export class Car {
	constructor(
		public readonly brand: string,
		public readonly model: string,
		public readonly description: string,
		public readonly fuel: Fuel,
		public readonly gearbox: Gearbox,
		public readonly engineCapacity: number,
		public readonly fuelConsumption: number,
		public readonly pledge: number,
		public readonly price: number,
		public readonly userId: number,
		public readonly id: number = NEW_ID,
	) {}
}
