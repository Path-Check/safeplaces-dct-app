module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./app/assets/fonts'],
  // add dependencies to this list when they require manual linking,
  // so that the CLI does not return an error
  dependencies: {
    'react-native-reanimated': {
      platforms: {
        android: undefined,
        ios: null,
      },
    },
  },
};
