import { Injectable } from '@nestjs/common';

import { Car, RentalOrder, User } from 'model';
import { CarListItemResponse, CarResponse, DetailedCarResponse, RentalOrderResponse } from 'interface/apiResponse';

@Injectable()
export class CarFormatter {
	public toCarResponse(car: Car): CarResponse {
		return {
			id: car.id,
			brand: car.brand,
			model: car.model,
			description: car.description,
			fuel: car.fuel,
			gearbox: car.gearbox,
			engineCapacity: car.engineCapacity,
			fuelConsumption: car.fuelConsumption,
			pledge: car.pledge,
			price: car.price,
		};
	}

	private toRentalOrder(order: RentalOrder, user: User): RentalOrderResponse {
		return {
			startAt: order.startAt,
			endAt: order.endAt,
			orderedByMe: order.userId === user.id,
		};
	}

	public toDetailedCarResponse(car: Car, rentalOrders: Array<RentalOrder>, user: User): DetailedCarResponse {
		return {
			...this.toCarResponse(car),
			rentalOrders: rentalOrders.map(order => this.toRentalOrder(order, user)),
		};
	}

	public toCarListItemResponse(car: Car): CarListItemResponse {
		return {
			...this.toCarResponse(car),
		};
	}
}
