import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { RentalOrder } from 'model';
import { Result } from 'shared/util/util';
import { RentalOrderEntity } from 'entity/rental_order.entity';

@Injectable()
export class RentalOrderRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<RentalOrder>> {
		const rentalOrderEntity = await this.manager.findOne(RentalOrderEntity, { id });

		return this.convertToModel(rentalOrderEntity);
	}

	public async getCarRentalOrders(carId: number): Promise<Array<RentalOrder>> {
		const rentalOrderEntities = await this.manager.find(RentalOrderEntity, { carId });

		return rentalOrderEntities.map(this.convertToModel) as Array<RentalOrder>;
	}

	public async insert(rentalOrder: RentalOrder): Promise<RentalOrder> {
		const { identifiers } = await this.manager
			.createQueryBuilder()
			.insert()
			.into(RentalOrderEntity)
			.values({
				startAt: rentalOrder.startAt,
				endAt: rentalOrder.endAt,
				userId: rentalOrder.userId,
				carId: rentalOrder.carId,
			})
			.execute();

		return (await this.getById(identifiers[0].id)) as RentalOrder;
	}

	public convertToModel(rentalOrderEntity?: RentalOrderEntity): Result<RentalOrder> {
		if (rentalOrderEntity) {
			return new RentalOrder(
				rentalOrderEntity.startAt,
				rentalOrderEntity.endAt,
				rentalOrderEntity.userId,
				rentalOrderEntity.carId,
				rentalOrderEntity.id,
			);
		}
	}
}
