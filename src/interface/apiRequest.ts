import { Fuel, Gearbox } from 'entity/car.entity';
import { IsEnum, IsInt, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from 'shared/decorator';

export enum Order {
	Asc = 'ASC',
	Desc = 'DESC',
}

export enum CarOrderBy {
	Price = 'car.price',
	EngineCapacity = 'car.engine_capacity',
}

export enum OwnCarOrderBy {
	CarId = 'car.id',
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

	@IsEnum(Fuel)
	@ApiProperty({ enum: Fuel })
	public readonly fuel: Fuel;

	@IsEnum(Gearbox)
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

export class CarImageRequest {
	@ApiProperty()
	filename: string;

	@ApiProperty({ type: Boolean })
	isTitle: boolean;
}

export class UpdateCarRequest extends CreateCarRequest {
	@ApiProperty({ type: CarImageRequest, isArray: true })
	images: Array<CarImageRequest>;
}

export class RentCarRequest {
	@ApiProperty({ type: Date })
	startAt: Date;

	@ApiProperty({ type: Date })
	endAt: Date;

	@ApiProperty()
	orderId: string;
}
