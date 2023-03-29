import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import * as fs from 'fs';

export class Init1680073666901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlQuery = fs.readFileSync(__dirname + '/base/init.sql', {encoding: 'utf-8'});
    const sqlQueries = sqlQuery.replace(/\r?\n|\r/g, " ").split(';');
    for await (const query of sqlQueries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('o_candle');
    await queryRunner.dropTable('o_order');
    await queryRunner.dropTable('o_product');
    await queryRunner.dropTable('o_user');
    
  }
}
