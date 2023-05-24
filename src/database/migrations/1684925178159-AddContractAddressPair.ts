import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddContractAddressPair1684925178159 implements MigrationInterface {
  private tbl = 'o_product';
  private colAdd = 'contract_address';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn(this.tbl, this.colAdd)) {
      return;
    }
    await queryRunner.addColumn(this.tbl, {
      name: this.colAdd,
      type: 'varchar',
      isNullable: true,
    } as TableColumn);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn(this.tbl, this.colAdd))) {
      return;
    }
    await queryRunner.dropColumn(this.tbl, this.colAdd);
  }
}
