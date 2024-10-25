export default {
  clearMocks: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/utils/singleton.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json'],
};