import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@services': '<rootDir>/src/services/index.ts',
    '@utils': '<rootDir>/src/utils/index.ts',
    'test/(.*)': '<rootDir>/test/$1',
  },
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  globalSetup: './test/setup.ts',
  // globalTeardown: './test/configs/teardown.ts',
  // collectCoverage: true,
  // collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  // coverageDirectory: 'coverage',
  // setupFiles: ['./test/configs/setupMock.ts'],
  // setupFilesAfterEnv: ['jest-extended'],
};

export default config;
