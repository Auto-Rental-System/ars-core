import { Injectable } from '@nestjs/common';

import { Car, CarImage, RentalOrder, User } from 'model';
import {
	CarImageResponse,
	CarImagesSignedPostUrlResponse,
	CarWithTitleImageResponse,
	CarResponse,
	CarWithImagesResponse,
	RentalOrderResponse,
	CarRentalOrdersResponse,
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

	public toRentalOrderResponse(order: RentalOrder): RentalOrderResponse {
		return {
			startAt: order.startAt,
			endAt: order.endAt,
			id: order.id,
			carId: order.carId,
			userId: order.userId,
		};
	}

	public toCarRentalOrdersResponse(car: Car, rentalOrders: Array<RentalOrder>): CarRentalOrdersResponse {
		return {
			carId: car.id,
			rentalOrders: rentalOrders.map(r => this.toRentalOrderResponse(r)),
		};
	}

	public toCarWithImagesResponse(car: Car, carImages: Array<CarImage>): CarWithImagesResponse {
		return {
			...this.toCarResponse(car),
			images: carImages.map(image => this.toCarImageResponse(image)),
		};
	}

	public toCarWithTitleImageResponse(car: Car, titleImage?: CarImage): CarWithTitleImageResponse {
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
					url: signedPostUrl.url,
					fields: signedPostUrl.fields,
				};
			}),
		};
	}
}
