import { MigrationInterface, QueryRunner, Table, TableIndex, TableUnique } from 'typeorm';

export class AddTableUserOrder1684212326154 implements MigrationInterface {
  tbl = 'o_user_volume';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tbl,
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'product_id',
            type: 'int',
          },
          {
            name: 'volume',
            type: 'decimal(32,16)',
            default: 0,
          },
          {
            name: 'granularity',
            type: 'int',
          },
          {
            name: 'time',
            type: 'bigint',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `ALTER TABLE "o_user_volume" ADD FOREIGN KEY ("user_id") REFERENCES "o_user" ("id");`,
    );

    await queryRunner.query(
      `ALTER TABLE "o_user_volume" ADD FOREIGN KEY ("product_id") REFERENCES "o_product" ("id");`,
    );

    await queryRunner.createUniqueConstraint(this.tbl, new TableUnique({
        name: 'o_user_volume_product_id_user_id_granularity_time_key',
        columnNames: ['product_id', 'user_id', 'granularity', 'time'],
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable(this.tbl))) {
      return;
    }

    await queryRunner.dropTable(this.tbl);
  }
}
