import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'entity/user.entity';
import { Fuel, Gearbox } from 'entity/car.entity';

export class UserResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	email: string;

	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty({ enum: UserRole })
	role: UserRole;
}

export class CarResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	brand: string;

	@ApiProperty()
	model: string;

	@ApiProperty()
	description: string;

	@ApiProperty({ enum: Fuel })
	fuel: Fuel;

	@ApiProperty({ enum: Gearbox })
	gearbox: Gearbox;

	@ApiProperty()
	engineCapacity: number;

	@ApiProperty()
	fuelConsumption: number;

	@ApiProperty()
	pledge: number;

	@ApiProperty()
	price: number;
}
