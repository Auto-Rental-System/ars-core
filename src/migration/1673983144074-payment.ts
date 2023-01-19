import {MigrationInterface, QueryRunner} from "typeorm";

export class payment1673983144074 implements MigrationInterface {
    name = 'payment1673983144074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_type_enum" AS ENUM('Checkout', 'Payout')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."payment_type_enum" NOT NULL, "gross_value" numeric(7,2) NOT NULL, "paypal_fee" numeric(6,2), "service_fee" numeric(6,2), "user_id" integer NOT NULL, "rental_order_id" integer NOT NULL, CONSTRAINT "UQ_2227cc91c2d4d44143f927decfb" UNIQUE ("type", "rental_order_id"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_4960762cb9d21630c552a0ce1b3" FOREIGN KEY ("rental_order_id") REFERENCES "rental_order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_4960762cb9d21630c552a0ce1b3"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_type_enum"`);
    }

}
