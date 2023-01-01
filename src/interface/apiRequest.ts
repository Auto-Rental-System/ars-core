import { ApiProperty } from '@nestjs/swagger';
import { Fuel, Gearbox } from 'entity/car.entity';

export class RegisterUserRequest {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;
}

export class CreateCarRequest {
	@ApiProperty()
	public readonly brand: string;

	@ApiProperty()
	public readonly model: string;

	@ApiProperty()
	public readonly description: string;

	@ApiProperty({ enum: Fuel })
	public readonly fuel: Fuel;

	@ApiProperty({ enum: Gearbox })
	public readonly gearbox: Gearbox;

	@ApiProperty({ type: Number, minimum: 1, maximum: 9 })
	public readonly engineCapacity: number;

	@ApiProperty({ minimum: 0.1, maximum: 99.9 })
	public readonly fuelConsumption: number;

	@ApiProperty({ type: Number, minimum: 1 })
	public readonly pledge: number;

	@ApiProperty({ type: Number, minimum: 1 })
	public readonly price: number;
}
