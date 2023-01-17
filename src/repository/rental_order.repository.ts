import { Injectable } from '@nestjs/common';
import { Brackets, EntityManager } from 'typeorm';

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

	public async getByCarId(carId: number): Promise<Array<RentalOrder>> {
		const rentalOrderEntities = await this.manager.find(RentalOrderEntity, { carId });

		return rentalOrderEntities.map(order => this.convertToModel(order)) as Array<RentalOrder>;
	}

	public async getByPaypalOrderIdCount(paypalOrderId: string): Promise<number> {
		return await this.manager.count(RentalOrderEntity, { paypalOrderId });
	}

	public async getInPeriodCount(carId: number, startAt: Date, endAt: Date): Promise<number> {
		return await this.manager
			.createQueryBuilder(RentalOrderEntity, 'rentalOrder')
			.where('rentalOrder.car_id = :carId', { carId })
			.andWhere(
				new Brackets(qb => {
					return qb
						.where('rentalOrder.start_at < :startAt', { startAt })
						.andWhere('rentalOrder.end_at < :startAt', { startAt });
				}),
			)
			.orWhere(
				new Brackets(qb => {
					return qb
						.where('rentalOrder.start_at < :endAt', { endAt })
						.andWhere('rentalOrder.end_at < :endAt', { endAt });
				}),
			)
			.getCount();
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
				paypalOrderId: rentalOrder.paypalOrderId,
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
				rentalOrderEntity.paypalOrderId,
				rentalOrderEntity.id,
			);
		}
	}
}
