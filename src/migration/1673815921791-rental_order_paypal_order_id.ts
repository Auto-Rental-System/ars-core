import {MigrationInterface, QueryRunner} from "typeorm";

export class rentalOrderPaypalOrderId1673815921791 implements MigrationInterface {
    name = 'rentalOrderPaypalOrderId1673815921791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental_order" ADD "paypal_order_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rental_order" ADD CONSTRAINT "UQ_85984cdb88f6c530c3453fb0c34" UNIQUE ("paypal_order_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental_order" DROP CONSTRAINT "UQ_85984cdb88f6c530c3453fb0c34"`);
        await queryRunner.query(`ALTER TABLE "rental_order" DROP COLUMN "paypal_order_id"`);
    }

}
