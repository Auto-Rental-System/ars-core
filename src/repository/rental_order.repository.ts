import { Injectable } from '@nestjs/common';
import { Brackets, EntityManager } from 'typeorm';

import { RentalOrder } from 'model';
import { Result } from 'shared/util/util';
import { RentalOrderEntity } from 'entity/rental_order.entity';
import { PaymentEntity, PaymentType } from 'entity/payment.entity';

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
				startAt: rentalOrder.startAt.toString(),
				endAt: rentalOrder.endAt.toString(),
				userId: rentalOrder.userId,
				carId: rentalOrder.carId,
				paypalOrderId: rentalOrder.paypalOrderId,
			})
			.execute();

		return (await this.getById(identifiers[0].id)) as RentalOrder;
	}

	public async getRentalOrdersToPayout(): Promise<Array<RentalOrder>> {
		const rentalOrderEntities = await this.manager
			.createQueryBuilder(RentalOrderEntity, 'rentalOrder')
			.where(queryBuilder => {
				const subQuery = queryBuilder
					.subQuery()
					.select('payment.rental_order_id')
					.from(PaymentEntity, 'payment')
					.where('payment.type = :payout', { payout: PaymentType.Payout })
					.getQuery();

				return `rentalOrder.id NOT IN ${subQuery}`;
			})
			.andWhere(`((rentalOrder.end_at)::date + '1 day'::interval) <= NOW()`)
			.getMany();

		return rentalOrderEntities.map(entity => this.convertToModel(entity)) as Array<RentalOrder>;
	}

	public convertToModel(rentalOrderEntity?: RentalOrderEntity): Result<RentalOrder> {
		if (rentalOrderEntity) {
			return new RentalOrder(
				new Date(rentalOrderEntity.startAt),
				new Date(rentalOrderEntity.endAt),
				rentalOrderEntity.userId,
				rentalOrderEntity.carId,
				rentalOrderEntity.paypalOrderId,
				rentalOrderEntity.id,
			);
		}
	}
}
