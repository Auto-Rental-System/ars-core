import { Controller, Get, HttpStatus, ParseIntPipe, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from 'shared/decorator';
import { Request } from 'shared/request';
import { UserRole } from 'entity/user.entity';
import { CarService } from 'service/car';
import { PaymentService } from 'service/payment';
import { OwnCarPaginationRequest } from 'value_object/pagination_request';
import { PaymentType } from 'entity/payment.entity';
import { OwnCarListResponse } from 'interface/apiResponse';
import { OwnCarOrderBy, Order } from 'interface/apiRequest';
import { ReportFormatter } from 'service/report';

@Controller('reports')
@ApiTags('Report')
export class ReportController {
	constructor(
		private readonly carService: CarService,
		private readonly paymentService: PaymentService,
		private readonly reportFormatter: ReportFormatter,
	) {}

	@Get('/cars/own')
	@Auth(UserRole.Landlord)
	@ApiQuery({ name: 'page', type: Number })
	@ApiQuery({ name: 'rowsPerPage', type: Number })
	@ApiQuery({ name: 'order', enum: Order, required: false, enumName: 'Order' })
	@ApiQuery({ name: 'orderBy', enum: OwnCarOrderBy, required: false, enumName: 'OwnCarOrderBy', type: String })
	@ApiQuery({ name: 'filters', isArray: true, type: String, required: false })
	@ApiResponse({ status: HttpStatus.OK, type: OwnCarListResponse })
	public async getMyCarsReport(
		@Req() { user }: Request,
		@Query('page', ParseIntPipe) page: number,
		@Query('rowsPerPage', ParseIntPipe) rowsPerPage: number,
		@Query('order') order: Order = Order.Asc,
		@Query('orderBy') orderBy: OwnCarOrderBy = OwnCarOrderBy.CarId,
		@Query('filters') filters: string | Array<string> = [],
	): Promise<OwnCarListResponse> {
		const paginationRequest = new OwnCarPaginationRequest(
			page,
			rowsPerPage,
			Array.isArray(filters) ? filters : [filters],
			order,
			orderBy,
		);

		const ownCars = await this.carService.getOwnCars(paginationRequest, user);
		const totalPayments = await this.paymentService.getCarsTotalPayments(ownCars.list, PaymentType.Payout);

		return this.reportFormatter.toOwnCarListResponse(ownCars, totalPayments);
	}
}
