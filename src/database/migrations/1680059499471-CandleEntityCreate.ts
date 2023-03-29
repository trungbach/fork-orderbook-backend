import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
} from 'typeorm';

export class CandleEntityCreate1680059499471 implements MigrationInterface {
  private tbl = 'o_candle';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tbl,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'candle_id',
            type: 'varchar',
          },
          {
            name: 'product_id',
            type: 'int',
          },
          {
            name: 'granularity',
            type: 'bigint',
          },
          {
            name: 'open',
            type: 'decimal',
            precision: 32,
            scale: 16,
          },
          {
            name: 'close',
            type: 'decimal',
            precision: 32,
            scale: 16,
          },
          {
            name: 'high',
            type: 'decimal',
            precision: 32,
            scale: 16,
          },
          {
            name: 'low',
            type: 'decimal',
            precision: 32,
            scale: 16,
          },
          {
            name: 'volume',
            type: 'decimal',
            precision: 32,
            scale: 16,
          },
          {
            name: 'time',
            type: 'bigint',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      this.tbl,
      new TableIndex({
        name: 'o_candle_product_granularity_time_idx',
        columnNames: ['product_id', 'granularity', 'time'],
      }),
    );

    await queryRunner.createIndex(
      this.tbl,
      new TableIndex({
        name: 'o_candle_candle_id',
        columnNames: ['candle_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tbl);
  }
}
