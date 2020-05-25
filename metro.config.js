/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const { getDefaultConfig } = require('metro-config');
const defaultConfig = getDefaultConfig.getDefaultValues(__dirname);
const blacklist = require('metro-config/src/defaults/blacklist');
const { TRACING_STRATEGY } = require('./metro-env.json');

module.exports = {
  resolver: {
    // react-native-local-resource
    assetExts: [...defaultConfig.resolver.assetExts, 'html'],
    blacklistRE: blacklist([
      `${TRACING_STRATEGY}` == 'bte' ? new RegExp(`app/services/LocationService.js`) : "",
    ]),
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
