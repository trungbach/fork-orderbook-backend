import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableTxs1680511719396 implements MigrationInterface {
  private tbl = 'o_txs';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tbl,
        columns: [
          {
            name: 'hash',
            type: 'varchar(64)',
            isPrimary: true,
          },
          {
            name: 'height',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'time',
            type: 'timestamp',
          },
          {
            name: 'data',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tbl, true);
  }
}
