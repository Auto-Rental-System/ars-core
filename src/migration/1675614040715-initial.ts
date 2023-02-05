import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1675614040715 implements MigrationInterface {
    name = 'initial1675614040715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_identity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, CONSTRAINT "UQ_7ad44f9fcbfc95e0a8436bbb029" UNIQUE ("email"), CONSTRAINT "PK_87b5856b206b5b77e6e2fa29508" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_type_enum" AS ENUM('Checkout', 'Payout')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('Success', 'Failed', 'Pending', 'Unclaimed', 'Returned', 'OnHold', 'Blocked', 'Refunded', 'Reversed')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."payment_type_enum" NOT NULL, "status" "public"."payment_status_enum" NOT NULL, "gross_value" numeric(7,2) NOT NULL, "paypal_fee" numeric(6,2) NOT NULL DEFAULT '0', "service_fee" numeric(6,2) NOT NULL DEFAULT '0', "paypal_payout_id" character varying, "user_id" integer NOT NULL, "rental_order_id" integer NOT NULL, CONSTRAINT "UQ_2227cc91c2d4d44143f927decfb" UNIQUE ("type", "rental_order_id"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rental_order" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "start_at" date NOT NULL, "end_at" date NOT NULL, "paypal_order_id" character varying NOT NULL, "user_id" integer NOT NULL, "car_id" integer NOT NULL, CONSTRAINT "UQ_85984cdb88f6c530c3453fb0c34" UNIQUE ("paypal_order_id"), CONSTRAINT "PK_117fcfe9a064c7321b6016b3b79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Renter', 'Landlord')`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('Active', 'Suspend')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "role" "public"."user_role_enum" NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'Active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_identity_id" integer NOT NULL, CONSTRAINT "UQ_7a3335acd11d07ce7f7c0ad09d7" UNIQUE ("user_identity_id", "role"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."car_fuel_enum" AS ENUM('Petrol', 'Diesel', 'Hybrid', 'Electric')`);
        await queryRunner.query(`CREATE TYPE "public"."car_gearbox_enum" AS ENUM('Manual', 'Automatic')`);
        await queryRunner.query(`CREATE TABLE "car" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "brand" character varying NOT NULL, "model" character varying NOT NULL, "description" character varying NOT NULL, "engine_capacity" numeric(2,1) NOT NULL, "fuel" "public"."car_fuel_enum" NOT NULL, "fuel_consumption" numeric(3,1) NOT NULL, "gearbox" "public"."car_gearbox_enum" NOT NULL, "pledge" smallint NOT NULL, "price" smallint NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_image" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "is_title" boolean NOT NULL, "car_id" integer NOT NULL, CONSTRAINT "PK_76cf0a3401a80a59c62f3576bbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_4960762cb9d21630c552a0ce1b3" FOREIGN KEY ("rental_order_id") REFERENCES "rental_order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rental_order" ADD CONSTRAINT "FK_14026a5b5bedc1800c1c46f648f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rental_order" ADD CONSTRAINT "FK_ee9110ccf1e69e77e1a41820657" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dee2c7a36ac4ca095ef46f64c3d" FOREIGN KEY ("user_identity_id") REFERENCES "user_identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_c8d34198d86de9e96aae03b8990" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_image" ADD CONSTRAINT "FK_2d2bb7b50ec40713d9086e07419" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_image" DROP CONSTRAINT "FK_2d2bb7b50ec40713d9086e07419"`);
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_c8d34198d86de9e96aae03b8990"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dee2c7a36ac4ca095ef46f64c3d"`);
        await queryRunner.query(`ALTER TABLE "rental_order" DROP CONSTRAINT "FK_ee9110ccf1e69e77e1a41820657"`);
        await queryRunner.query(`ALTER TABLE "rental_order" DROP CONSTRAINT "FK_14026a5b5bedc1800c1c46f648f"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_4960762cb9d21630c552a0ce1b3"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b"`);
        await queryRunner.query(`DROP TABLE "car_image"`);
        await queryRunner.query(`DROP TABLE "car"`);
        await queryRunner.query(`DROP TYPE "public"."car_gearbox_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_fuel_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "rental_order"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_type_enum"`);
        await queryRunner.query(`DROP TABLE "user_identity"`);
    }

}
