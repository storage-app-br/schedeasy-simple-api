import { DataSource } from 'typeorm';
import { API_ENTITIES } from '../../util/db/typeorm/typeorm.config';

describe('ScheduleModel', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: API_ENTITIES,
      synchronize: true,
    });

    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should have the correct columns in the schedule table', async () => {
    // Verifica as colunas da tabela diretamente no banco SQLite em memória
    const result = await dataSource.query(`PRAGMA table_info("schedules")`);

    // Defina as colunas esperadas
    const expectedColumns = [
      "id",
      "corporation_id",
      "worker_id",
      "client_id",
      "service_ids",
      "date",
      "start_at",
      "end_at",
      "duration",
      "price",
      "created_at",
      "updated_at"
    ];

    const columnNames = result.map((column: any) => column.name);

    expectedColumns.forEach((column) => {
      expect(columnNames).toContain(column);
    });
  });
});
