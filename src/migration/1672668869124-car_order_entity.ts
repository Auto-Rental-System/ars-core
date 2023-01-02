import {MigrationInterface, QueryRunner} from "typeorm";

export class carOrderEntity1672668869124 implements MigrationInterface {
    name = 'carOrderEntity1672668869124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "car_rental_order" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "user_id" integer NOT NULL, "car_id" integer NOT NULL, CONSTRAINT "PK_5e10148050c41741832adf4f147" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "car_rental_order" ADD CONSTRAINT "FK_14026a5b5bedc1800c1c46f648f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_rental_order" ADD CONSTRAINT "FK_ee9110ccf1e69e77e1a41820657" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_rental_order" DROP CONSTRAINT "FK_ee9110ccf1e69e77e1a41820657"`);
        await queryRunner.query(`ALTER TABLE "car_rental_order" DROP CONSTRAINT "FK_14026a5b5bedc1800c1c46f648f"`);
        await queryRunner.query(`DROP TABLE "car_rental_order"`);
    }

}
