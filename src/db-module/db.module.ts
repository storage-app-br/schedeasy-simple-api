import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_SCHEMA_TYPE } from '../config-module/config.module';
import { getTypeOrmConfig } from '../util/db/typeorm/typeorm.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        return await getTypeOrmConfig(configService);
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule { }
