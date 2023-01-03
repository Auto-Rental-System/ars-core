import { Injectable } from '@nestjs/common';

import { CreateCarRequest, UpdateCarRequest } from 'interface/apiRequest';
import { Car, User } from 'model';
import { CarRepository, CarImageRepository } from 'repository';
import { ApplicationError } from 'shared/error';
import { PaginationResponse } from 'value_object';
import { CarPaginationRequest } from 'value_object/pagination_request/car_pagination_request';
import { StorageService, SignedPostUrlResponse } from 'service/storage';
import { ConfigService } from '@nestjs/config';
import { CarConfig } from 'config/interfaces';

@Injectable()
export class CarService {
	private readonly carConfig: CarConfig;

	constructor(
		private readonly carRepository: CarRepository,
		private readonly storageService: StorageService,
		private readonly configService: ConfigService,
		private readonly carImageRepository: CarImageRepository,
	) {
		const carConfig: CarConfig = this.configService.get<CarConfig>('car') as CarConfig;
		this.carConfig = carConfig;
	}

	public async getById(id: number): Promise<Car> {
		const car = await this.carRepository.getById(id);

		if (!car) {
			throw new CarNotExistError();
		}

		return car;
	}

	public async create(body: CreateCarRequest, user: User): Promise<Car> {
		let car = new Car(
			body.brand,
			body.model,
			body.description,
			body.fuel,
			body.gearbox,
			body.engineCapacity,
			body.fuelConsumption,
			body.pledge,
			body.price,
			user.id,
		);

		car = await this.carRepository.insert(car);

		return car;
	}

	public async update(car: Car, body: UpdateCarRequest): Promise<Car> {
		car.brand = body.brand;
		car.model = body.model;
		car.description = body.description;
		car.fuel = body.fuel;
		car.gearbox = body.gearbox;
		car.engineCapacity = body.engineCapacity;
		car.fuelConsumption = body.fuelConsumption;
		car.pledge = body.pledge;
		car.price = body.price;

		car = await this.carRepository.update(car);
		return car;
	}

	public async getAllCars(paginationRequest: CarPaginationRequest): Promise<PaginationResponse<Car>> {
		const result = await this.carRepository.getAllCars(paginationRequest);

		return new PaginationResponse<Car>(
			paginationRequest.page,
			paginationRequest.rowsPerPage,
			result.total,
			result.list,
		);
	}

	public getS3FolderKey(car: Car, user: User): string {
		return `user/${user.id}/car/${car.id}`;
	}

	public async getImageSignedPostUrls(
		car: Car,
		user: User,
		filenames: Array<string>,
	): Promise<Array<SignedPostUrlResponse>> {
		const folder = this.getS3FolderKey(car, user);
		const result = await this.storageService.getSignedPostUrls(folder, filenames, this.carConfig.maxImageSize);

		return result;
	}
}

export class CarNotExistError extends ApplicationError {}
