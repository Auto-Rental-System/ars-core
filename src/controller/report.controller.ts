import { Controller, Get, HttpStatus, ParseIntPipe, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from 'shared/decorator';
import { Request } from 'shared/request';
import { UserRole } from 'entity/user.entity';
import { CarService } from 'service/car';
import { PaymentService } from 'service/payment';
import { OrderPaginationRequest, OwnCarPaginationRequest } from 'value_object/pagination_request';
import { PaymentType } from 'entity/payment.entity';
import { OrderListResponse, OwnCarListResponse } from 'interface/apiResponse';
import { Order, OrderListOrderBy, OwnCarListOrderBy } from 'interface/apiRequest';
import { ReportFormatter } from 'service/report';
import { RentalService } from 'service/rental';

@Controller('reports')
@ApiTags('Report')
export class ReportController {
	constructor(
		private readonly carService: CarService,
		private readonly paymentService: PaymentService,
		private readonly reportFormatter: ReportFormatter,
		private readonly rentalService: RentalService,
	) {}

	@Get('/cars/own')
	@Auth(UserRole.Landlord)
	@ApiQuery({ name: 'page', type: Number })
	@ApiQuery({ name: 'rowsPerPage', type: Number })
	@ApiQuery({ name: 'order', enum: Order, required: false, enumName: 'Order' })
	@ApiQuery({ name: 'orderBy', enum: OwnCarListOrderBy, required: false, enumName: 'OwnCarListOrderBy', type: String })
	@ApiQuery({ name: 'filters', isArray: true, type: String, required: false })
	@ApiResponse({ status: HttpStatus.OK, type: OwnCarListResponse })
	public async getMyCarsReport(
		@Req() { user }: Request,
		@Query('page', ParseIntPipe) page: number,
		@Query('rowsPerPage', ParseIntPipe) rowsPerPage: number,
		@Query('order') order: Order = Order.Asc,
		@Query('orderBy') orderBy: OwnCarListOrderBy = OwnCarListOrderBy.CarId,
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

	@Get('/orders')
	@Auth()
	@ApiQuery({ name: 'page', type: Number })
	@ApiQuery({ name: 'rowsPerPage', type: Number })
	@ApiQuery({ name: 'order', enum: Order, required: false, enumName: 'Order' })
	@ApiQuery({ name: 'orderBy', enum: OrderListOrderBy, required: false, enumName: 'OrderListOrderBy', type: String })
	@ApiQuery({ name: 'filters', isArray: true, type: String, required: false })
	@ApiResponse({ status: HttpStatus.OK, type: OrderListResponse })
	public async getMyOrders(
		@Req() { user }: Request,
		@Query('page', ParseIntPipe) page: number,
		@Query('rowsPerPage', ParseIntPipe) rowsPerPage: number,
		@Query('order') order: Order = Order.Asc,
		@Query('orderBy') orderBy: OrderListOrderBy = OrderListOrderBy.OrderId,
		@Query('filters') filters: string | Array<string> = [],
	): Promise<OrderListResponse> {
		const paginationRequest = new OrderPaginationRequest(
			page,
			rowsPerPage,
			Array.isArray(filters) ? filters : [filters],
			order,
			orderBy,
		);

		const orders = await this.rentalService.getOrders(paginationRequest, user);

		const carIds = orders.list.map(order => order.carId);
		const cars = await this.carService.getByIds(carIds);

		const paymentType = user.is(UserRole.Landlord) ? PaymentType.Payout : PaymentType.Checkout;
		const payments = await this.paymentService.getByOrdersAndType(orders.list, paymentType);

		return this.reportFormatter.toOrderListResponse(orders, cars, payments);
	}
}
