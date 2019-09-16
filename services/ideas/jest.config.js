module.exports = {
  preset: 'ts-jest',
  //preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['<rootDir>/**/*.spec.ts'],
};
