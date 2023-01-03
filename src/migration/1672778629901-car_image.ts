import {MigrationInterface, QueryRunner} from "typeorm";

export class carImage1672778629901 implements MigrationInterface {
    name = 'carImage1672778629901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "car_image" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "is_title" boolean NOT NULL, "car_id" integer NOT NULL, CONSTRAINT "PK_76cf0a3401a80a59c62f3576bbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "car_image" ADD CONSTRAINT "FK_2d2bb7b50ec40713d9086e07419" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_image" DROP CONSTRAINT "FK_2d2bb7b50ec40713d9086e07419"`);
        await queryRunner.query(`DROP TABLE "car_image"`);
    }

}
