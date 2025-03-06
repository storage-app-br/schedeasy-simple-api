import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CONFIG_SCHEMA_TYPE } from '../../../config-module/config.module';
import { ScheduleModel } from '../../../schedules/entity/schedules.entity';

export const API_ENTITIES = [ScheduleModel];
export const API_MIGRATIONS = [];

export const getTypeOrmConfig = async (
  configService: ConfigService<CONFIG_SCHEMA_TYPE>,
): Promise<TypeOrmModuleOptions> => {
  const dbVendor = await configService.get('DB_VENDOR');
  switch (dbVendor) {
    case 'sqlite':
      return {
        type: 'sqlite',
        database: ':memory:',
        entities: API_ENTITIES,
        migrations: API_MIGRATIONS,
        logging: configService.get('DB_LOGGING'),
        synchronize: configService.get('SYNCHRONIZE'),
      };
    case 'postgres':
      return {
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: API_ENTITIES,
        migrations: API_MIGRATIONS,
        logging: configService.get('DB_LOGGING'),
        synchronize: configService.get('SYNCHRONIZE'),
      };
    default:
      throw new Error(`DB_VENDOR not supported: ${dbVendor}`);
  }
};
