import { Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';

import { Result } from 'shared/util/util';
import { Payment } from 'model';
import { PaymentEntity, PaymentType } from 'entity/payment.entity';

export interface TotalPayment {
	grossValue: number;
	paypalFee?: number;
	serviceFee?: number;
}

export interface TotalPaymentRaw {
	car_id: number;
	gross_value: number;
	paypal_fee?: number;
	service_fee?: number;
}

@Injectable()
export class PaymentRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<Payment>> {
		const paymentEntity = await this.manager.createQueryBuilder(PaymentEntity, 'payment').where({ id }).getOne();

		return this.convertToModel(paymentEntity);
	}

	public async insert(payment: Payment): Promise<Payment> {
		const { identifiers } = await this.manager
			.createQueryBuilder()
			.insert()
			.into(PaymentEntity)
			.values({
				rentalOrderId: payment.rentalOrderId,
				userId: payment.userId,
				type: payment.type,
				grossValue: payment.grossValue,
				paypalFee: payment.paypalFee,
				serviceFee: payment.serviceFee,
			})
			.execute();

		return (await this.getById(identifiers[0].id)) as Payment;
	}

	public async getByRentalOrderIdAndType(rentalOrderId: number, type: PaymentType): Promise<Result<Payment>> {
		const paymentEntity = await this.manager
			.createQueryBuilder(PaymentEntity, 'payment')
			.where({ rentalOrderId, type })
			.getOne();

		return this.convertToModel(paymentEntity);
	}

	//carId, TotalPayment
	public async getCarPayments(carIds: Array<number>, type: PaymentType): Promise<Map<number, TotalPayment>> {
		const totalPayments = new Map<number, TotalPayment>();

		const result: Array<TotalPaymentRaw> = await this.manager.query(`
			SELECT
				car_id,
				SUM(p.gross_value) as gross_value,
				SUM(p.paypal_fee) as paypal_fee,
				SUM(p.service_fee) as service_fee
			FROM payment p
			LEFT JOIN rental_order ro ON p.rental_order_id = ro.id
			WHERE p.type = 'Checkout'
			AND ro.car_id IN (5, 14)
			GROUP BY ro.car_id;
		`);

		result.forEach(raw => {
			totalPayments.set(raw.car_id, {
				grossValue: raw.gross_value,
				paypalFee: raw.paypal_fee,
				serviceFee: raw.service_fee,
			});
		});

		return totalPayments;
	}

	public async getRentalOrdersPayments(rentalOrderIds, type: PaymentType): Promise<Array<Payment>> {
		const paymentEntities = await this.manager
			.createQueryBuilder(PaymentEntity, 'payment')
			.where({ rentalOrderId: In(rentalOrderIds), type })
			.getMany();

		return paymentEntities.map(paymentEntity => this.convertToModel(paymentEntity)) as Array<Payment>;
	}

	private convertToModel(paymentEntity?: PaymentEntity): Result<Payment> {
		if (paymentEntity) {
			return new Payment(
				paymentEntity.rentalOrderId,
				paymentEntity.userId,
				paymentEntity.type,
				paymentEntity.grossValue,
				paymentEntity.paypalFee,
				paymentEntity.serviceFee,
				paymentEntity.id,
			);
		}
	}
}
