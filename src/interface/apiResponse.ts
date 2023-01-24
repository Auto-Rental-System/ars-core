import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'entity/user.entity';
import { Fuel, Gearbox } from 'entity/car.entity';
import { PaymentStatus, PaymentType } from 'entity/payment.entity';
import { CarListOrderBy, Order } from './apiRequest';

export class UserResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	email: string;

	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty({ enum: UserRole, enumName: 'UserRole' })
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

	@ApiProperty({ enum: Fuel, enumName: 'Fuel' })
	fuel: Fuel;

	@ApiProperty({ enum: Gearbox, enumName: 'Gearbox' })
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

export class PaymentResponse {
	@ApiProperty({ type: Number })
	userId: number;

	@ApiProperty({ enum: PaymentType, enumName: 'PaymentType' })
	type: PaymentType;

	@ApiProperty({ enum: PaymentStatus, enumName: 'PaymentStatus' })
	status: PaymentStatus;

	@ApiProperty({ type: Number })
	grossValue: number;

	@ApiProperty({ type: Number })
	netValue: number;

	@ApiProperty({ type: Number })
	paypalFee: number;

	@ApiProperty({ type: Number })
	serviceFee: number;
}

export class RentalOrderResponse {
	@ApiProperty({ type: Number })
	id: number;

	@ApiProperty({ type: Date })
	startAt: Date;

	@ApiProperty({ type: Date })
	endAt: Date;

	@ApiProperty({ type: Number })
	carId: number;
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
	@ApiProperty({ type: CarImageResponse, required: false })
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

export class OwnCarListItemResponse extends CarResponse {
	@ApiProperty()
	netValue: number;
}

export class OwnCarListResponse {
	@ApiProperty({ isArray: true, type: OwnCarListItemResponse })
	list: Array<OwnCarListItemResponse>;

	@ApiProperty()
	page: number;

	@ApiProperty()
	rowsPerPage: number;

	@ApiProperty()
	total: number;
}

export class OrderListItemResponse {
	@ApiProperty({ type: CarResponse })
	car: CarResponse;

	@ApiProperty({ type: RentalOrderResponse })
	order: RentalOrderResponse;

	@ApiProperty({ type: PaymentResponse })
	payment: PaymentResponse;
}

export class OrderListResponse {
	@ApiProperty({ isArray: true, type: OrderListItemResponse })
	list: Array<OrderListItemResponse>;

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

export class DevInfoResponse {
	@ApiProperty({ enum: CarListOrderBy, enumName: 'CarOrderBy' })
	carOrderBy?: CarListOrderBy;

	@ApiProperty({ enum: Order, enumName: 'Order' })
	order?: Order;
}
