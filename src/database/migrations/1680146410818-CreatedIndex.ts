import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreatedIndex1680146410818 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'o_order',
      new TableIndex({
        name: 'idx_order_product_id',
        columnNames: ['product_id'],
      }),
    );

    await queryRunner.createIndex(
      'o_order',
      new TableIndex({
        name: 'idx_order_user_id',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'o_order',
      new TableIndex({
        name: 'idx_order_product_id_user_id',
        columnNames: ['product_id', 'user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('o_order', 'idx_order_product_id');
    await queryRunner.dropIndex('o_order', 'idx_order_user_id');
    await queryRunner.dropIndex('o_order', 'idx_order_product_id_user_id');
  }
}
