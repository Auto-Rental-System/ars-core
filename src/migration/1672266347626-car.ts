import {MigrationInterface, QueryRunner} from "typeorm";

export class car1672266347626 implements MigrationInterface {
    name = 'car1672266347626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."car_fuel_enum" AS ENUM('Petrol', 'Diesel', 'Hybrid', 'Electric')`);
        await queryRunner.query(`CREATE TYPE "public"."car_gearbox_enum" AS ENUM('Manual', 'Automatic')`);
        await queryRunner.query(`CREATE TABLE "car" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "brand" character varying NOT NULL, "model" character varying NOT NULL, "description" character varying NOT NULL, "engine_capacity" numeric(2,1) NOT NULL, "fuel" "public"."car_fuel_enum" NOT NULL, "fuel_consumption" numeric(3,1) NOT NULL, "gearbox" "public"."car_gearbox_enum" NOT NULL, "pledge" smallint NOT NULL, "price" smallint NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_c8d34198d86de9e96aae03b8990" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_c8d34198d86de9e96aae03b8990"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "car"`);
        await queryRunner.query(`DROP TYPE "public"."car_gearbox_enum"`);
        await queryRunner.query(`DROP TYPE "public"."car_fuel_enum"`);
    }

}
