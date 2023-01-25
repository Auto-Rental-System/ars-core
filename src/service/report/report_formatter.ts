import { Injectable } from '@nestjs/common';

import { OrderListResponse, OwnCarListItemResponse, MyCarListResponse } from 'interface/apiResponse';
import { PaginationResponse } from 'value_object';
import { Car, CarImage, Payment, RentalOrder } from 'model';
import { CarFormatter } from 'service/car';
import { TotalPayment } from 'repository/payment_repository';
import { toDoublePrecisionFloat } from 'shared/util/util';
import { PaymentFormatter } from 'service/payment';

@Injectable()
export class ReportFormatter {
	constructor(private readonly carFormatter: CarFormatter, private readonly paymentFormatter: PaymentFormatter) {}

	public toMyCarListResponse(
		carsPaginationResponse: PaginationResponse<Car>,
		titleImages: Array<CarImage>,
		totalPayments: Map<number, TotalPayment>,
	): MyCarListResponse {
		const list: Array<OwnCarListItemResponse> = carsPaginationResponse.list.map(car => {
			const titleImage = titleImages.find(t => t.carId === car.id);
			const carTotalPayments = totalPayments.get(car.id);
			const netValue = carTotalPayments
				? carTotalPayments.grossValue - carTotalPayments.paypalFee - carTotalPayments.serviceFee
				: 0;

			return {
				...this.carFormatter.toCarWithTitleImageResponse(car, titleImage),
				netValue: toDoublePrecisionFloat(netValue),
				totalDaysRented: carTotalPayments?.days || 0,
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
		carsTitleImages: Array<CarImage>,
		payments: Array<Payment>,
	): OrderListResponse {
		return {
			list: ordersPaginationResponse.list.map(order => {
				const car = cars.find(car => car.id === order.carId);
				const titleImage = car && carsTitleImages.find(c => c.carId === car.id);
				const payment = payments.find(payment => payment.rentalOrderId === order.id);

				return {
					car: this.carFormatter.toCarWithTitleImageResponse(car as Car, titleImage),
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
