import { ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { CONFIG_SCHEMA_TYPE } from "../../../config-module/config.module";
import { getTypeOrmConfig } from "./typeorm.config";

const createDataSource = async (): Promise<DataSource> => {
  const configService = new ConfigService<CONFIG_SCHEMA_TYPE>();
  const typeOrmConfig = await getTypeOrmConfig(configService);
  const dataSource = new DataSource(typeOrmConfig as DataSourceOptions);

  return dataSource;
};
export default createDataSource();