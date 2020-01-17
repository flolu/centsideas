module.exports = {
  // FIXME path maps are in jest-config, package.json and tsconfig... would be better if they are in one place
  moduleNameMapper: {
    '^@cents-ideas/utils(.*)$': '<rootDir>/packages/utils$1',
    '^@cents-ideas/event-sourcing(.*)$': '<rootDir>/packages/event-sourcing$1',
    '^@cents-ideas/enums(.*)$': '<rootDir>/packages/enums$1',
    '^@cents-ideas/models(.*)$': '<rootDir>/packages/models$1',
  },
};
