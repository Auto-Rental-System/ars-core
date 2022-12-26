import {MigrationInterface, QueryRunner} from "typeorm";

export class defaultUserStatus1672082928102 implements MigrationInterface {
    name = 'defaultUserStatus1672082928102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'Active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
