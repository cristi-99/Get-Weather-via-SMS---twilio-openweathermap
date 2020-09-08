import { MigrationInterface, QueryRunner } from 'typeorm';
import { Source } from '../weather/source.entity';

export class AddSources1599479738171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sourceTable = queryRunner.connection.getRepository(Source);
    await sourceTable.insert([
      { id: 1, source: 'Messenger' },
      { id: 2, source: 'SMS' },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
