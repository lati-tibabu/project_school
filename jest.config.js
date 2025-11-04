module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/node_modules/**',
    '!backend/modules/**/models/**',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  verbose: true
};
