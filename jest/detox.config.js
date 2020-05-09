module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest/setupFile.js'],
  setupFilesAfterEnv: ['./e2e/init.js'],
  testEnvironment: 'node',
  reporters: ['detox/runners/jest/streamlineReporter'],
  verbose: true,
  rootDir: '../',
  testPathIgnorePatterns: ['node_modules', 'app'],
};
