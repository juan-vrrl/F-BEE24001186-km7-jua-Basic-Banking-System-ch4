import { config } from 'dotenv';
config({ path: '.env.test' });

export default {
  clearMocks: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/utils/singleton.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true,
};