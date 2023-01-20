import {MigrationInterface, QueryRunner} from "typeorm";

export class paymentDefaultValues1674236065155 implements MigrationInterface {
    name = 'paymentDefaultValues1674236065155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paypal_fee" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paypal_fee" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "service_fee" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "service_fee" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "service_fee" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "service_fee" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paypal_fee" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paypal_fee" DROP NOT NULL`);
    }

}
