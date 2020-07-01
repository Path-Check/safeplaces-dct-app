module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest/setupFile.js'],
  rootDir: '../',
  testPathIgnorePatterns: [
    'e2e',
    'node_modules',
    'node_modules/(?!(@react-native-community|react-native)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
