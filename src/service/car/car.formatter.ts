import { Injectable } from '@nestjs/common';

import { Car, CarImage, RentalOrder, User } from 'model';
import {
	CarImageResponse,
	CarImagesSignedPostUrlResponse,
	CarListItemResponse,
	CarResponse,
	DetailedCarResponse,
	RentalOrderResponse,
} from 'interface/apiResponse';
import { SignedPostUrlResponse } from 'service/storage';

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

	public toCarImageResponse(image: CarImage): CarImageResponse {
		return {
			filename: image.name,
			isTitle: image.isTitle,
			url: image.url || '',
		};
	}

	private toRentalOrder(order: RentalOrder, user: User): RentalOrderResponse {
		return {
			startAt: order.startAt,
			endAt: order.endAt,
			orderedByMe: order.userId === user.id,
		};
	}

	public toDetailedCarResponse(
		car: Car,
		rentalOrders: Array<RentalOrder>,
		carImages: Array<CarImage>,
		user: User,
	): DetailedCarResponse {
		return {
			...this.toCarResponse(car),
			rentalOrders: rentalOrders.map(order => this.toRentalOrder(order, user)),
			images: carImages.map(image => this.toCarImageResponse(image)),
		};
	}

	public toCarListItemResponse(car: Car, titleImage?: CarImage): CarListItemResponse {
		return {
			...this.toCarResponse(car),
			titleImage: titleImage && this.toCarImageResponse(titleImage),
		};
	}

	public toCarImagesSignedPostUrlResponse(
		signedPostUrls: Array<SignedPostUrlResponse>,
	): CarImagesSignedPostUrlResponse {
		return {
			list: signedPostUrls.map(signedPostUrl => {
				return {
					filename: signedPostUrl.filename,
					url: signedPostUrl.filename,
					fields: signedPostUrl.fields,
				};
			}),
		};
	}
}
