module.exports = {
  preset: 'react-native',
  setupFiles: [
    './jest/setupFile.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  rootDir: '../',
  testPathIgnorePatterns: [
    'e2e',
    'node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
