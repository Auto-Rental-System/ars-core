import {MigrationInterface, QueryRunner} from "typeorm";

export class rentalOrderDateType1673190544791 implements MigrationInterface {
    name = 'rentalOrderDateType1673190544791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental_order" DROP COLUMN "start_at"`);
        await queryRunner.query(`ALTER TABLE "rental_order" ADD "start_at" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rental_order" DROP COLUMN "end_at"`);
        await queryRunner.query(`ALTER TABLE "rental_order" ADD "end_at" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental_order" DROP COLUMN "end_at"`);
        await queryRunner.query(`ALTER TABLE "rental_order" ADD "end_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rental_order" DROP COLUMN "start_at"`);
        await queryRunner.query(`ALTER TABLE "rental_order" ADD "start_at" TIMESTAMP NOT NULL`);
    }

}
