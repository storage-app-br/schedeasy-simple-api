import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.interface.ts',
    '-interface.ts',
    'shared/testing',
    'shared-module/testing',
    'validator-rules.ts',
    '-fixture.ts',
    '.input.ts',
    '.d.ts',
    '.src/main.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 60,
      functions: 80,
      lines: 80,
    },
  },
  testEnvironment: 'node',
  coverageProvider: 'v8',
  clearMocks: true,
};

export default config;
