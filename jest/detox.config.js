module.exports = {
  preset: 'react-native',
  setupFiles: [
    './jest/setupFile.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  setupFilesAfterEnv: ['./e2e/init.js'],
  testEnvironment: 'node',
  reporters: ['detox/runners/jest/streamlineReporter'],
  verbose: true,
  rootDir: '../',
  testPathIgnorePatterns: ['node_modules', 'app'],
};
