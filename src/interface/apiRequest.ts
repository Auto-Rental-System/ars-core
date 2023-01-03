import { ApiProperty } from '@nestjs/swagger';
import { Fuel, Gearbox } from 'entity/car.entity';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export enum Order {
	Asc = 'ASC',
	Desc = 'DESC',
}

export enum CarOrderBy {
	Price = 'car.price',
	EngineCapacity = 'car.engine_capacity',
}

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

	@IsNumber()
	@Min(0.1)
	@Max(9.9)
	@ApiProperty({ type: Number, minimum: 0.1, maximum: 9.9 })
	public readonly engineCapacity: number;

	@IsNumber()
	@Min(0.1)
	@Max(99.9)
	@ApiProperty({ minimum: 0.1, maximum: 99.9 })
	public readonly fuelConsumption: number;

	@IsInt()
	@ApiProperty({ type: Number, minimum: 1 })
	public readonly pledge: number;

	@IsInt()
	@ApiProperty({ type: Number, minimum: 1 })
	public readonly price: number;
}

export class UpdateCarRequest extends CreateCarRequest {}

export class RentCarRequest {
	@ApiProperty({ type: Date })
	startAt: Date;

	@ApiProperty({ type: Date })
	endAt: Date;
}
