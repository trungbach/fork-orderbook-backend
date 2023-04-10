import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterOrderColVolume1680511719496 implements MigrationInterface {
  private tbl = 'o_order';
  private colAdd = 'volume';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn(this.tbl, this.colAdd)) {
      return;
    }
    await queryRunner.addColumn(this.tbl, {
      name: this.colAdd,
      type: 'decimal(32,16)',
      isNullable: false,
      default: 0,
    } as TableColumn);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn(this.tbl, this.colAdd))) {
      return;
    }
    await queryRunner.dropColumn(this.tbl, this.colAdd);
  }
}
