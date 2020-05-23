// TODO move if possible

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@centsideas/(.*)$': '<rootDir>/packages/$1',
    '^@cic/(.*)$': '<rootDir>/services/client/$1',
  },
};
