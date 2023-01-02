import { Fuel, Gearbox } from 'entity/car.entity';
import { NEW_ID } from 'shared/util/util';

export class Car {
	constructor(
		public brand: string,
		public model: string,
		public description: string,
		public fuel: Fuel,
		public gearbox: Gearbox,
		public engineCapacity: number,
		public fuelConsumption: number,
		public pledge: number,
		public price: number,
		public readonly userId: number,
		public readonly id: number = NEW_ID,
	) {}
}
