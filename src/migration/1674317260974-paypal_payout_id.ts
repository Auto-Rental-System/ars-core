import {MigrationInterface, QueryRunner} from "typeorm";

export class paypalPayoutId1674317260974 implements MigrationInterface {
    name = 'paypalPayoutId1674317260974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "paypal_payout_id" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."payment_status_enum" RENAME TO "payment_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('Success', 'Failed', 'Pending', 'Unclaimed', 'Returned', 'OnHold', 'Blocked', 'Refunded', 'Reversed')`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "status" TYPE "public"."payment_status_enum" USING "status"::"text"::"public"."payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum_old" AS ENUM('Denied', 'Pending', 'Processing', 'Success', 'Canceled')`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "status" TYPE "public"."payment_status_enum_old" USING "status"::"text"::"public"."payment_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payment_status_enum_old" RENAME TO "payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "paypal_payout_id"`);
    }

}
