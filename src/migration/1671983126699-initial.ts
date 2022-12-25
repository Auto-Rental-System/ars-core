import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1671983126699 implements MigrationInterface {
    name = 'initial1671983126699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Renter', 'Landlord')`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('Active', 'Suspend')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL, "status" "public"."user_status_enum" NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "user_identity_id" integer NOT NULL, CONSTRAINT "UQ_7a3335acd11d07ce7f7c0ad09d7" UNIQUE ("user_identity_id", "role"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_identity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, CONSTRAINT "UQ_7ad44f9fcbfc95e0a8436bbb029" UNIQUE ("email"), CONSTRAINT "PK_87b5856b206b5b77e6e2fa29508" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dee2c7a36ac4ca095ef46f64c3d" FOREIGN KEY ("user_identity_id") REFERENCES "user_identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dee2c7a36ac4ca095ef46f64c3d"`);
        await queryRunner.query(`DROP TABLE "user_identity"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
