// @flow

module.exports = {
  browser: false,
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '@spotty/(.*)': '<rootDir>/packages/$1'
  },
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  verbose: true
};
