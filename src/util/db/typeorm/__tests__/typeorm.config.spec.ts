import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { API_ENTITIES, getTypeOrmConfig } from '../typeorm.config';

describe('getTypeOrmConfig', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService({
      DB_VENDOR: 'sqlite',
      DB_LOGGING: false,
      SYNCHRONIZE: true,
    });
  });

  it('should return SQLite configuration when DB_VENDOR is sqlite', async () => {
    const config = await getTypeOrmConfig(configService);

    expect(config).toEqual<TypeOrmModuleOptions>({
      type: 'sqlite',
      database: ':memory:',
      entities: API_ENTITIES,
      migrations: [],
      logging: false,
      synchronize: true,
    });
  });

  it('should return PostgreSQL configuration when DB_VENDOR is postgres', async () => {
    configService = new ConfigService({
      DB_VENDOR: 'postgres',
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USERNAME: 'test_user',
      DB_PASSWORD: 'test_password',
      DB_DATABASE: 'test_db',
      DB_LOGGING: true,
      SYNCHRONIZE: false,
    });

    const config = await getTypeOrmConfig(configService);

    expect(config).toEqual<TypeOrmModuleOptions>({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test_user',
      password: 'test_password',
      database: 'test_db',
      entities: API_ENTITIES,
      migrations: [],
      logging: true,
      synchronize: false,
    });
  });

  it('should throw an error when DB_VENDOR is unsupported', async () => {
    configService = new ConfigService({ DB_VENDOR: 'unsupported' });

    await expect(getTypeOrmConfig(configService)).rejects.toThrow(
      'DB_VENDOR not supported: unsupported',
    );
  });
});
