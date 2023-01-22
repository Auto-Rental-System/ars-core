import * as p from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CarImageRequest, CreateCarRequest, UpdateCarRequest } from 'interface/apiRequest';
import { Car, CarImage, User } from 'model';
import { CarRepository, CarImageRepository } from 'repository';
import { ApplicationError } from 'shared/error';
import { PaginationResponse } from 'value_object';
import { CarPaginationRequest } from 'value_object/pagination_request/car_pagination_request';
import { StorageService, SignedPostUrlResponse } from 'service/storage';
import { CarConfig } from 'config/interfaces';
import { Result } from 'shared/util/util';
import { OwnCarPaginationRequest } from 'value_object/pagination_request';

@Injectable()
export class CarService {
	private readonly carConfig: CarConfig;

	constructor(
		private readonly carRepository: CarRepository,
		private readonly storageService: StorageService,
		private readonly configService: ConfigService,
		private readonly carImageRepository: CarImageRepository,
	) {
		this.carConfig = this.configService.get<CarConfig>('car') as CarConfig;
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

	public async getCarImages(car: Car, withGetUrl?: boolean): Promise<Array<CarImage>> {
		let carImages = await this.carImageRepository.getCarImages(car.id);
		if (!withGetUrl) {
			return carImages;
		}

		carImages = await Promise.all(
			carImages.map(async carImage => {
				const key = this.getS3CarImageKey(car, carImage);
				const url = await this.storageService.getSignedGetUrl(key);
				carImage.url = url;
				return carImage;
			}),
		);

		return carImages;
	}

	public async getCarTitleImage(car: Car): Promise<Result<CarImage>> {
		const titleImage = await this.carImageRepository.getCarTitleImage(car.id);
		if (!titleImage) {
			return titleImage;
		}

		const key = this.getS3CarImageKey(car, titleImage);
		titleImage.url = await this.storageService.getSignedGetUrl(key);

		return titleImage;
	}

	// Please, make sure that you upload images that belong to one car
	public async ensureImagesUploadedToS3(car: Car, images: Array<CarImage>): Promise<void> {
		const folder = this.getS3FolderKey(car);
		const folderObjects = await this.storageService.getFolderObjects(folder);
		const uploadedImageFilenames = (folderObjects.Contents || []).map(content => p.basename(content.Key as string));

		images.forEach(image => {
			if (!uploadedImageFilenames.includes(image.name)) {
				throw new CarImageNotUploadedToS3Error();
			}
		});
	}

	public async deleteImages(car: Car, images: Array<CarImage>): Promise<void> {
		await Promise.all(
			images.map(async image => {
				const key = this.getS3CarImageKey(car, image);
				await this.storageService.deleteFile(key);
			}),
		);

		const imageIds = images.map(image => image.id);
		await this.carImageRepository.delete(imageIds);
	}

	public async insertImages(car: Car, images: Array<CarImage>): Promise<void> {
		await this.ensureImagesUploadedToS3(car, images);
		await this.carImageRepository.insert(images);
	}

	public async updateCar(car: Car, body: UpdateCarRequest): Promise<Car> {
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

	public async updateCarImages(car: Car, images: Array<CarImageRequest>): Promise<Array<CarImage>> {
		const carImages = await this.getCarImages(car);

		const notOneTitleImage = images.filter(image => image.isTitle).length !== 1;

		if (notOneTitleImage) {
			throw new NotOneTitleImageError();
		}

		const imagesFromRequestToAdd = images.filter(
			image => !carImages.some(carImage => carImage.name === image.filename),
		);
		const imagesToAdd: Array<CarImage> = imagesFromRequestToAdd.map(image => {
			return new CarImage(image.filename, image.isTitle, car.id, car.userId);
		});

		const imagesToDelete: Array<CarImage> = carImages.filter(
			carImage => !images.some(image => image.filename === carImage.name),
		);

		await this.insertImages(car, imagesToAdd);
		await this.deleteImages(car, imagesToDelete);

		return await this.getCarImages(car, true);
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

	public async getOwnCars(paginationRequest: OwnCarPaginationRequest, user: User): Promise<PaginationResponse<Car>> {
		const result = await this.carRepository.getOwnCars(paginationRequest, user.id);

		return new PaginationResponse(paginationRequest.page, paginationRequest.rowsPerPage, result.total, result.list);
	}

	public getS3FolderKey(car: Car): string {
		return `images/user/${car.userId}/car/${car.id}`;
	}

	public getS3CarImageKey(car: Car, image: CarImage): string {
		const folder = this.getS3FolderKey(car);
		return p.join(folder, image.name);
	}

	public async getImageSignedPostUrls(car: Car, filenames: Array<string>): Promise<Array<SignedPostUrlResponse>> {
		const folder = this.getS3FolderKey(car);
		// TODO: Allow only certain image extensions
		const result = await this.storageService.getSignedPostUrls(folder, filenames, this.carConfig.maxImageSize);

		return result;
	}
}

export class CarNotExistError extends ApplicationError {}
export class CarImageNotUploadedToS3Error extends ApplicationError {}
export class NotOneTitleImageError extends ApplicationError {}
