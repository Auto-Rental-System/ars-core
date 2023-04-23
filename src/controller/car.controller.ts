import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from 'shared/decorator';
import { UserRole } from 'entity/user.entity';
import {
	CarImagesSignedPostUrlResponse,
	CarListResponse,
	CarRentalOrdersResponse,
	CarResponse,
	CarWithImagesResponse,
} from 'interface/apiResponse';
import { CarListOrderBy, CreateCarRequest, Order, RentCarRequest, UpdateCarRequest } from 'interface/apiRequest';
import { RequestingUser } from 'shared/decorator';
import { CarFormatter, CarService } from 'service/car';
import { RentalService } from 'service/rental';
import { PaypalService } from 'service/paypal';
import { PaymentService } from 'service/payment';
import { CarPaginationRequest } from 'value_object/pagination_request/car_pagination_request';
import { User } from 'model';

@Controller('cars')
@ApiTags('Car')
export class CarController {
	constructor(
		private readonly carService: CarService,
		private readonly carFormatter: CarFormatter,
		private readonly rentalService: RentalService,
		private readonly paypalService: PaypalService,
		private readonly paymentService: PaymentService,
	) {}

	@Post()
	@Auth(UserRole.Landlord)
	@ApiResponse({ status: HttpStatus.OK, type: CarResponse })
	public async create(@RequestingUser() user: User, @Body() body: CreateCarRequest): Promise<CarResponse> {
		const car = await this.carService.create(body, user);
		return this.carFormatter.toCarResponse(car);
	}

	@Get('/:id/images/signed-urls/post')
	@Auth(UserRole.Landlord)
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiQuery({ name: 'filenames', isArray: true, type: String })
	@ApiResponse({ status: HttpStatus.OK, type: CarImagesSignedPostUrlResponse })
	public async getImagesSignedPostUrls(
		@RequestingUser() user: User,
		@Param('id', ParseIntPipe) id: number,
		@Query('filenames') filenames: Array<string>,
	): Promise<CarImagesSignedPostUrlResponse> {
		const car = await this.carService.getById(id);

		const signedPostUrls = await this.carService.getImageSignedPostUrls(car, filenames);
		return this.carFormatter.toCarImagesSignedPostUrlResponse(signedPostUrls);
	}

	@Get()
	@ApiQuery({ name: 'page', type: Number })
	@ApiQuery({ name: 'rowsPerPage', type: Number })
	@ApiQuery({ name: 'order', enum: Order, required: false, enumName: 'Order' })
	@ApiQuery({ name: 'orderBy', enum: CarListOrderBy, required: false, enumName: 'CarListOrderBy', type: String })
	@ApiQuery({ name: 'filters', isArray: true, type: String, required: false })
	@ApiResponse({ status: HttpStatus.OK, type: CarListResponse })
	public async getAllCars(
		@Query('page', ParseIntPipe) page: number,
		@Query('rowsPerPage', ParseIntPipe) rowsPerPage: number,
		@Query('order') order: Order = Order.Asc,
		@Query('orderBy') orderBy: CarListOrderBy = CarListOrderBy.Price,
		@Query('filters') filters: string | Array<string> = [],
	): Promise<CarListResponse> {
		const paginationRequest = new CarPaginationRequest(
			page,
			rowsPerPage,
			Array.isArray(filters) ? filters : [filters],
			order,
			orderBy,
		);

		const result = await this.carService.getAllCars(paginationRequest);

		return {
			list: await Promise.all(
				result.list.map(async car => {
					const titleImage = await this.carService.getCarTitleImage(car);
					return this.carFormatter.toCarWithTitleImageResponse(car, titleImage);
				}),
			),
			page: result.page,
			rowsPerPage: result.rowsPerPage,
			total: result.total,
		};
	}

	@Get('/:id/rental-orders')
	@Auth(UserRole.Renter, UserRole.Landlord)
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiQuery({ name: 'from' })
	@ApiQuery({ name: 'to' })
	@ApiResponse({ status: HttpStatus.OK, type: CarRentalOrdersResponse })
	public async getRentalOrders(
		@RequestingUser() user: User,
		@Param('id', ParseIntPipe) id: number,
		@Query('from') from: Date,
		@Query('to') to: Date,
	): Promise<CarRentalOrdersResponse> {
		const car = await this.carService.getById(id);

		const rentalOrders = await this.rentalService.getCarRentalOrders(car, from, to);

		return this.carFormatter.toCarRentalOrdersResponse(car, rentalOrders);
	}

	@Get('/:id')
	@Auth()
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiResponse({ status: HttpStatus.OK, type: CarWithImagesResponse })
	public async getById(@Param('id', new ParseIntPipe()) id: number): Promise<CarWithImagesResponse> {
		const car = await this.carService.getById(id);

		const carImages = await this.carService.getCarImages(car, true);

		return this.carFormatter.toCarWithImagesResponse(car, carImages);
	}

	@Put('/:id')
	@Auth(UserRole.Landlord)
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiResponse({ status: HttpStatus.OK, type: CarWithImagesResponse })
	public async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() body: UpdateCarRequest,
	): Promise<CarWithImagesResponse> {
		let car = await this.carService.getById(id);

		car = await this.carService.updateCar(car, body);
		const carImages = await this.carService.updateCarImages(car, body.images);

		return this.carFormatter.toCarWithImagesResponse(car, carImages);
	}

	@Post('/:id/order')
	@Auth(UserRole.Renter)
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiResponse({ status: HttpStatus.OK, type: CarWithImagesResponse })
	public async rent(
		@RequestingUser() user: User,
		@Param('id', ParseIntPipe) id: number,
		@Body() body: RentCarRequest,
	): Promise<CarWithImagesResponse> {
		const car = await this.carService.getById(id);

		await this.paypalService.ensureCarRentalWasPaid(car, body);
		await this.rentalService.ensureNoRentalOrdersByPaypalOrderId(body.orderId);
		await this.rentalService.ensureNoCarRentalPeriodsIntercepts(car, body);

		const rentalOrder = await this.rentalService.rent(car, body, user);

		await this.paymentService.createCheckoutPayment(body.orderId, rentalOrder);

		const carImages = await this.carService.getCarImages(car, true);

		return this.carFormatter.toCarWithImagesResponse(car, carImages);
	}
}
