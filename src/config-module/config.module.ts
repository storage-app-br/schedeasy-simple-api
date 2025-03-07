import { Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import Joi from 'joi';
import { join } from 'path';

type DB_SCHEMA_TYPE = {
  API_TARGET_PORT?: number;
  API_PORT?: number;
  DB_VENDOR: 'postgres' | 'sqlite';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_LOGGING: boolean;
  SYNCHRONIZE: boolean;
};

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  API_PORT: Joi.number().optional(),
  API_TARGET_PORT: Joi.number().optional(),
  DB_VENDOR: Joi.string().required().valid('postgres', 'sqlite'),
  DB_HOST: Joi.string().when('DB_VENDOR', {
    is: ['postgres'],
    then: Joi.required(),
  }),
  DB_DATABASE: Joi.string().when('DB_VENDOR', {
    is: ['postgres'],
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when('DB_VENDOR', {
    is: ['postgres'],
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_VENDOR', {
    is: ['postgres'],
    then: Joi.required(),
  }),
  DB_PORT: Joi.number()
    .integer()
    .when('DB_VENDOR', {
      is: ['postgres'],
      then: Joi.required(),
    }),
  DB_LOGGING: Joi.boolean().required(),
  SYNCHRONIZE: Joi.boolean().when('DB_VENDOR', {
    is: ['sqlite', 'postgres'],
    then: Joi.required(),
  }),
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const { envFilePath, ...otherOptions } = options;
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath!]),
        join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV!}`),
        join(process.cwd(), 'envs', `.env`),
      ],
      validationSchema: Joi.object({
        ...CONFIG_DB_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}
