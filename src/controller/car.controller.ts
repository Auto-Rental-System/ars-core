import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from 'shared/decorator';
import { UserRole } from 'entity/user.entity';
import { CarResponse } from 'interface/apiResponse';
import { CreateCarRequest } from 'interface/apiRequest';
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
}
