import { EntityManager, In } from 'typeorm';

import { CarImageEntity } from 'entity/car_image.entity';
import { CarImage } from 'model';
import { Result } from 'shared/util/util';

export class CarImageRepository {
	constructor(private manager: EntityManager) {}

	public async insert(images: Array<CarImage>): Promise<void> {
		const imageEntities = images.map(image => {
			return {
				name: image.name,
				isTitle: image.isTitle,
				carId: image.carId,
			};
		});

		await this.manager.createQueryBuilder().insert().into(CarImageEntity).values(imageEntities).execute();
	}

	public async getCarImages(carId: number): Promise<Array<CarImage>> {
		const carImageEntities = await this.manager
			.createQueryBuilder(CarImageEntity, 'carImage')
			.where('carImage.car_id = :carId', { carId })
			.getMany();

		return carImageEntities.map(carImageEntity => this.convertToModel(carImageEntity)) as Array<CarImage>;
	}

	public async getCarTitleImage(carId: number): Promise<Result<CarImage>> {
		const carEntity = await this.manager
			.createQueryBuilder(CarImageEntity, 'carImage')
			.where({ carId, isTitle: true })
			.getOne();

		return this.convertToModel(carEntity);
	}

	public async delete(carImageIds: Array<number>): Promise<void> {
		await this.manager
			.createQueryBuilder(CarImageEntity, 'carImage')
			.delete()
			.from(CarImageEntity)
			.where({ id: In(carImageIds) })
			.execute();
	}

	private convertToModel(carImageEntity?: CarImageEntity): Result<CarImage> {
		if (carImageEntity) {
			return new CarImage(carImageEntity.name, carImageEntity.isTitle, carImageEntity.carId, carImageEntity.id);
		}
	}
}