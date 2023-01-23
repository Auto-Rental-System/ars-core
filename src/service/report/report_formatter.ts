import { Injectable } from '@nestjs/common';

import { OrderListResponse, OwnCarListResponse } from 'interface/apiResponse';
import { PaginationResponse } from 'value_object';
import { Car, Payment, RentalOrder } from 'model';
import { CarFormatter } from 'service/car';
import { TotalPayment } from 'repository/payment_repository';
import { toDoublePrecisionFloat } from 'shared/util/util';
import { PaymentFormatter } from 'service/payment';

@Injectable()
export class ReportFormatter {
	constructor(private readonly carFormatter: CarFormatter, private readonly paymentFormatter: PaymentFormatter) {}

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

	public toOrderListResponse(
		ordersPaginationResponse: PaginationResponse<RentalOrder>,
		cars: Array<Car>,
		payments: Array<Payment>,
	): OrderListResponse {
		return {
			list: ordersPaginationResponse.list.map(order => {
				const car = cars.find(car => car.id === order.carId);
				const payment = payments.find(payment => payment.rentalOrderId === order.id);

				return {
					car: this.carFormatter.toCarResponse(car as Car),
					payment: this.paymentFormatter.toPaymentResponse(payment as Payment),
					order: this.carFormatter.toRentalOrderResponse(order),
				};
			}),
			page: ordersPaginationResponse.page,
			rowsPerPage: ordersPaginationResponse.rowsPerPage,
			total: ordersPaginationResponse.total,
		};
	}
}
