import { EntityManager } from 'typeorm';

import { CarImageEntity } from 'entity/car_image.entity';
import { CarImage } from 'model';
import { Result } from 'shared/util/util';

export class CarImageRepository {
	constructor(private manager: EntityManager) {}

	public async getCarImages(carId: number): Promise<Array<CarImage>> {
		const carImageEntities = await this.manager
			.createQueryBuilder(CarImageEntity, 'carImage')
			.where('carImage.car_id = :carId', { carId })
			.getMany();

		return carImageEntities.map(carImageEntity => this.convertToModel(carImageEntity)) as Array<CarImage>;
	}

	private convertToModel(carImageEntity?: CarImageEntity): Result<CarImage> {
		if (carImageEntity) {
			return new CarImage(carImageEntity.name, carImageEntity.isTitle, carImageEntity.carId, carImageEntity.id);
		}
	}
}
