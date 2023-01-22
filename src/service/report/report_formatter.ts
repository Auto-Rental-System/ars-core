import { Injectable } from '@nestjs/common';

import { OwnCarListResponse } from 'interface/apiResponse';
import { PaginationResponse } from 'value_object';
import { Car } from 'model';
import { CarFormatter } from 'service/car';
import { TotalPayment } from 'repository/payment_repository';
import { toDoublePrecisionFloat } from 'shared/util/util';

@Injectable()
export class ReportFormatter {
	constructor(private readonly carFormatter: CarFormatter) {}

	public toOwnCarListResponse(
		carsPaginationResponse: PaginationResponse<Car>,
		totalPayments: Map<number, TotalPayment>,
	): OwnCarListResponse {
		const list = carsPaginationResponse.list.map(car => {
			const carTotalPayments = totalPayments.get(car.id);
			const netValue = carTotalPayments
				? carTotalPayments.grossValue - carTotalPayments.paypalFee - carTotalPayments.serviceFee
				: 0;
			return {
				...this.carFormatter.toCarResponse(car),
				netValue: toDoublePrecisionFloat(netValue),
			};
		});

		return {
			list,
			total: carsPaginationResponse.total,
			rowsPerPage: carsPaginationResponse.rowsPerPage,
			page: carsPaginationResponse.page,
		};
	}
}
