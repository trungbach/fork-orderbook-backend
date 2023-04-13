import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeNameColumnAmountVolume1681368195270
  implements MigrationInterface
{
  tableName = 'o_order';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(this.tableName, 'amount', 'ask_amount');
    await queryRunner.renameColumn(this.tableName, 'volume', 'offer_amount');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(this.tableName, 'ask_amount', 'amount');
    await queryRunner.renameColumn(this.tableName, 'offer_amount', 'volume');
  }
}
