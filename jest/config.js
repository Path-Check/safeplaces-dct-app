const jestPreset = require('@testing-library/react-native/jest-preset');

module.exports = {
  preset: '@testing-library/react-native',
  setupFiles: [
    './jest/setupFile.js',
    ...jestPreset.setupFiles,
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native-community|react-native|react-native-pulse|react-native-linear-gradient)/)',
  ],
  rootDir: '../',
  testPathIgnorePatterns: [
    'e2e',
    'node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
