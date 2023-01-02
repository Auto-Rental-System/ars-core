import { Body, Controller, Get, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from 'shared/decorator';
import { UserRole } from 'entity/user.entity';
import { CarResponse } from 'interface/apiResponse';
import { CreateCarRequest, UpdateCarRequest } from 'interface/apiRequest';
import { Request } from 'shared/request';
import { CarFormatter, CarService } from 'service/car';

@Controller('cars')
@ApiTags('Car')
export class CarController {
	constructor(private readonly carService: CarService, private readonly carFormatter: CarFormatter) {}

	@Post('')
	@Auth(UserRole.Renter)
	@ApiResponse({ status: HttpStatus.OK, type: CarResponse })
	public async create(@Req() { user }: Request, @Body() body: CreateCarRequest): Promise<CarResponse> {
		const car = await this.carService.create(body, user);
		return this.carFormatter.toCarResponse(car);
	}

	@Get(':id')
	@Auth()
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiResponse({ status: HttpStatus.OK, type: CarResponse })
	public async getById(@Req() { user }: Request, @Param('id') id: number): Promise<CarResponse> {
		const car = await this.carService.getById(id);

		return this.carFormatter.toCarResponse(car);
	}

	@Put(':id')
	@Auth(UserRole.Renter)
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiResponse({ status: HttpStatus.OK, type: CarResponse })
	public async update(
		@Req() { user }: Request,
		@Param('id') id: number,
		@Body() body: UpdateCarRequest,
	): Promise<CarResponse> {
		let car = await this.carService.getById(id);

		car = await this.carService.update(car, body);

		return this.carFormatter.toCarResponse(car);
	}

	@Post('/:id/rent')
	@Auth(UserRole.Renter)
	@ApiParam({ name: 'id', required: true, type: Number })
	@ApiResponse({ status: HttpStatus.OK, type: CarResponse })
	public async rent(@Req() { user }: Request, @Param('id') id: number): Promise<CarResponse> {
		const car = await this.carService.getById(id);

		return this.carFormatter.toCarResponse(car);
	}
}
