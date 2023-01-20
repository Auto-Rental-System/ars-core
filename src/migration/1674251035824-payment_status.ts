import {MigrationInterface, QueryRunner} from "typeorm";

export class paymentStatus1674251035824 implements MigrationInterface {
    name = 'paymentStatus1674251035824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('Denied', 'Pending', 'Processing', 'Success', 'Canceled')`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "status" "public"."payment_status_enum" NOT NULL DEFAULT 'Success'`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "status" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    }

}
