/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('metro-config');
const defaultConfig = getDefaultConfig.getDefaultValues(__dirname);

module.exports = {
  resolver: {
    // react-native-local-resource
    assetExts: [...defaultConfig.resolver.assetExts, 'html'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
