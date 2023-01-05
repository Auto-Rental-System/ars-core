import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from 'shared/decorator';
import { UserRole } from 'entity/user.entity';
import {
	CarImagesSignedPostUrlResponse,
	CarListResponse,
	CarResponse,
	DetailedCarResponse,
} from 'interface/apiResponse';
import { CarOrderBy, CreateCarRequest, Order, RentCarRequest, UpdateCarRequest } from 'interface/apiRequest';
import { Request } from 'shared/request';
import { CarFormatter, CarRentalService, CarService } from 'service/car';
import { CarPaginationRequest } from 'value_object/pagination_request/car_pagination_request';

@Controller('cars')
@ApiTags('Car')
export class CarController {
	constructor(
		private readonly carService: CarService,
		private readonly carFormatter: CarFormatter,
		private readonly carRentalService: CarRentalService,
	) {}

	@Post()
	@Auth(UserRole.Landlord)
	@ApiResponse({ status: HttpStatus.OK, type: CarResponse })
	public async create(@Req() { user }: Request, @Body() body: CreateCarRequest): Promise<CarResponse> {
		const car = await this.carService.create(body, user);
		return this.carFormatter.toCarResponse(car);
	}

	@Get('/:id/images/signed-urls/post')
	@Auth(UserRole.Renter)
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiQuery({ name: 'filenames', isArray: true, type: String })
	@ApiResponse({ status: HttpStatus.OK, type: CarImagesSignedPostUrlResponse })
	public async getImagesSignedPostUrls(
		@Req() { user }: Request,
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
	@ApiQuery({ name: 'orderBy', enum: CarOrderBy, required: false, enumName: 'CarOrderBy', type: String })
	@ApiQuery({ name: 'filters', isArray: true, type: String, required: false })
	@ApiResponse({ status: HttpStatus.OK, type: CarListResponse })
	public async getAllCars(
		@Query('page', ParseIntPipe) page: number,
		@Query('rowsPerPage', ParseIntPipe) rowsPerPage: number,
		@Query('order') order: Order = Order.Asc,
		@Query('orderBy') orderBy: CarOrderBy = CarOrderBy.Price,
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
					return this.carFormatter.toCarListItemResponse(car, titleImage);
				}),
			),
			page: result.page,
			rowsPerPage: result.rowsPerPage,
			total: result.total,
		};
	}

	@Get('/:id')
	@Auth()
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiResponse({ status: HttpStatus.OK, type: DetailedCarResponse })
	public async getById(
		@Req() { user }: Request,
		@Param('id', new ParseIntPipe()) id: number,
	): Promise<DetailedCarResponse> {
		const car = await this.carService.getById(id);
		const rentalOrders = await this.carRentalService.getCarRentalOrders(car);

		const carImages = await this.carService.getCarImages(car, true);

		return this.carFormatter.toDetailedCarResponse(car, rentalOrders, carImages, user);
	}

	@Put('/:id')
	@Auth(UserRole.Renter)
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiResponse({ status: HttpStatus.OK, type: DetailedCarResponse })
	public async update(
		@Req() { user }: Request,
		@Param('id', ParseIntPipe) id: number,
		@Body() body: UpdateCarRequest,
	): Promise<DetailedCarResponse> {
		let car = await this.carService.getById(id);

		car = await this.carService.updateCar(car, body);
		const carImages = await this.carService.updateCarImages(car, body.images);
		const rentalOrders = await this.carRentalService.getCarRentalOrders(car);

		return this.carFormatter.toDetailedCarResponse(car, rentalOrders, carImages, user);
	}

	@Post('/:id/rent')
	@Auth(UserRole.Renter)
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiResponse({ status: HttpStatus.OK, type: DetailedCarResponse })
	public async rent(
		@Req() { user }: Request,
		@Param('id', ParseIntPipe) id: number,
		@Body() body: RentCarRequest,
	): Promise<DetailedCarResponse> {
		const car = await this.carService.getById(id);

		const rentalOrders = await this.carRentalService.rent(car, body, user);
		const carImages = await this.carService.getCarImages(car, true);

		return this.carFormatter.toDetailedCarResponse(car, rentalOrders, carImages, user);
	}
}
