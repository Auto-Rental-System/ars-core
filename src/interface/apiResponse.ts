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

export class RentalOrderResponse {
	@ApiProperty({ type: Date })
	startAt: Date;

	@ApiProperty({ type: Date })
	endAt: Date;

	@ApiProperty({ type: Boolean })
	orderedByMe: boolean;
}

export class CarImageResponse {
	@ApiProperty()
	filename: string;

	@ApiProperty()
	url: string;

	@ApiProperty({ type: Boolean })
	isTitle: boolean;
}

export class DetailedCarResponse extends CarResponse {
	@ApiProperty({ isArray: true, type: RentalOrderResponse })
	rentalOrders: Array<RentalOrderResponse>;

	@ApiProperty({ type: CarImageResponse, isArray: true })
	images: Array<CarImageResponse>;
}

export class CarListItemResponse extends CarResponse {
	@ApiProperty({ type: CarImageResponse })
	titleImage?: CarImageResponse;
}

export class CarListResponse {
	@ApiProperty({ isArray: true, type: CarListItemResponse })
	list: Array<CarListItemResponse>;

	@ApiProperty()
	page: number;

	@ApiProperty()
	rowsPerPage: number;

	@ApiProperty()
	total: number;
}

export class ImageSignedPostUrlResponse {
	@ApiProperty()
	filename: string;

	@ApiProperty()
	url: string;

	@ApiProperty()
	fields: Record<string, string>;
}

export class CarImagesSignedPostUrlResponse {
	@ApiProperty({ type: ImageSignedPostUrlResponse, isArray: true })
	list: Array<ImageSignedPostUrlResponse>;
}
