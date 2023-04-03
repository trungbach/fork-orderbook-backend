import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';

export class Init1680073666901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlQuery = fs.readFileSync(__dirname + '/base/init.sql', {
      encoding: 'utf-8',
    });
    const sqlQueries = sqlQuery.replace(/\r?\n|\r/g, ' ').split(';');
    for await (const query of sqlQueries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('o_candle', true);
    await queryRunner.dropTable('o_order', true);
    await queryRunner.dropTable('o_product', true);
    await queryRunner.dropTable('o_user', true);
    await queryRunner.dropTable('o_txs', true);
  }
}
