import { Test } from '@nestjs/testing';
import * as Joi from 'joi';
import { join } from 'path';
import { CONFIG_DB_SCHEMA, ConfigModule } from '../../../../config-module/config.module';

function expectValidate(schema: Joi.ObjectSchema, value: any) {
  const validationResult = schema.validate(value, { abortEarly: false });
  return expect(validationResult.error ? validationResult.error.message : null);
}

describe('Schema Unit Test', () => {
  describe('DB Schema', () => {
    const schema = Joi.object({
      ...CONFIG_DB_SCHEMA,
    });

    describe('API_PORT', () => {
      test('invalid cases', () => {
        expectValidate(schema, { API_PORT: 'string' }).toContain(
          '"API_PORT" must be a number',
        );
      });
    });

    describe('API_TARGET_PORT', () => {
      test('invalid cases', () => {
        expectValidate(schema, { API_TARGET_PORT: 'string' }).toContain(
          '"API_TARGET_PORT" must be a number',
        );
      });
    });

    describe('DB_VENDOR', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_VENDOR" is required');

        expectValidate(schema, { DB_VENDOR: 5 }).toContain(
          '"DB_VENDOR" must be one of [postgres, sqlite]',
        );
      });

      test('valid cases', () => {
        const arrange = ['postgres', 'sqlite'];
        arrange.forEach((value) => {
          expectValidate(schema, { DB_VENDOR: value }).not.toContain(
            'DB_VENDOR',
          );
        });
      });
    });

    describe('DB_HOST', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          '"DB_HOST" is required',
        );

        expectValidate(schema, { DB_VENDOR: 'postgres' }).toContain(
          '"DB_HOST" is required',
        );

        expectValidate(schema, { DB_HOST: 1 }).toContain(
          '"DB_HOST" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = ['some value'];

        arrange.forEach((value) => {
          expectValidate(schema, { DB_HOST: value }).not.toContain('DB_HOST');
        });
      });
    });

    describe('DB_DATABASE', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          '"DB_DATABASE" is required',
        );

        expectValidate(schema, { DB_VENDOR: 'postgres' }).toContain(
          '"DB_DATABASE" is required',
        );

        expectValidate(schema, { DB_DATABASE: 1 }).toContain(
          '"DB_DATABASE" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'sqlite' },
          { DB_VENDOR: 'sqlite', DB_DATABASE: 'some value' },
          { DB_VENDOR: 'postgres', DB_DATABASE: 'some value' },
          { DB_VENDOR: 'mysql', DB_DATABASE: 'some value' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_DATABASE');
        });
      });
    });

    describe('DB_USERNAME', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          '"DB_USERNAME" is required',
        );

        expectValidate(schema, { DB_USERNAME: 1 }).toContain(
          '"DB_USERNAME" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'sqlite' },
          { DB_VENDOR: 'sqlite', DB_USERNAME: 'some value' },
          { DB_VENDOR: 'mysql', DB_USERNAME: 'some value' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_USERNAME');
        });
      });
    });

    describe('DB_PASSWORD', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          '"DB_PASSWORD" is required',
        );

        expectValidate(schema, { DB_PASSWORD: 1 }).toContain(
          '"DB_PASSWORD" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'sqlite' },
          { DB_VENDOR: 'sqlite', DB_PASSWORD: 'some value' },
          { DB_VENDOR: 'mysql', DB_PASSWORD: 'some value' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_PASSWORD');
        });
      });
    });

    describe('DB_PORT', () => {
      test('invalid cases', () => {

        expectValidate(schema, { DB_PORT: 'a' }).toContain(
          '"DB_PORT" must be a number',
        );

        expectValidate(schema, { DB_PORT: '1.2' }).toContain(
          '"DB_PORT" must be an integer',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'sqlite' },
          { DB_VENDOR: 'sqlite', DB_PORT: 10 },
          { DB_VENDOR: 'sqlite', DB_PORT: '10' },
          { DB_VENDOR: 'mysql', DB_PORT: 10 },
          { DB_VENDOR: 'mysql', DB_PORT: '10' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_PORT');
        });
      });
    });

    describe('DB_LOGGING', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_LOGGING" is required');

        expectValidate(schema, { DB_LOGGING: 'a' }).toContain(
          '"DB_LOGGING" must be a boolean',
        );
      });

      test('valid cases', () => {
        const arrange = [true, false, 'true', 'false'];

        arrange.forEach((value) => {
          expectValidate(schema, { DB_LOGGING: value }).not.toContain(
            'DB_LOGGING',
          );
        });
      });
    });

    describe('SYNCHRONIZE', () => {
      test('invalid cases', () => {
        expectValidate(schema, {
          DB_VENDOR: 'sqlite',
        }).toContain('"SYNCHRONIZE" is required');

        expectValidate(schema, {
          DB_VENDOR: 'postgres',
        }).toContain('"SYNCHRONIZE" is required');

        expectValidate(schema, { SYNCHRONIZE: 'a' }).toContain(
          '"SYNCHRONIZE" must be a boolean',
        );
      });

      test('valid cases', () => {
        const arrange = [true, false, 'true', 'false'];

        arrange.forEach((value) => {
          expectValidate(schema, { SYNCHRONIZE: value }).not.toContain(
            'SYNCHRONIZE',
          );
        });
      });
    });
  });
});
describe('ConfigModule Unit Tests', () => {
  it('should not throwwhen env vars are valid', () => {
    try {
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: join(__dirname, './.env.fake'),
          }),
        ],
      });
    } catch (e) {
      expect(e.message).toContain(
        '"DB_VENDOR" must be one of [postgres, sqlite]',
      );
    }
  });

  it('should throw when env vars are invalid', () => {
    try {
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: join(__dirname, './.env.invalid'),
          }),
        ],
      });
    } catch (e) {
      expect(e.message).toContain('"DB_VENDOR" is required');
    }
  });
});
